import axios from "axios";

const endpoint = process.env.ANILIST_URL || "https://graphql.anilist.co";

const client = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

let lastCall = 0;
let cooldownUntil = 0;
let queued = Promise.resolve();

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function cleanVars(vars) {
  const out = {};
  const keys = Object.keys(vars || {});
  for (let i = 0; i < keys.length; i++) {
    const v = vars[keys[i]];
    if (v === undefined || v === null || v === "") {
      continue;
    }
    out[keys[i]] = v;
  }
  return out;
}

function checkBody(body) {
  if (body && body.errors && body.errors.length > 0) {
    const first = body.errors[0] || {};
    const text = first.message || "Not found";
    const e = new Error(text);
    if (/not found/i.test(text)) {
      e.statusCode = 404;
    } else {
      e.statusCode = 400;
    }
    throw e;
  }
  return body;
}

async function runQuery(query, variables) {
  const now = Date.now();
  const earliest = Math.max(lastCall + 700, cooldownUntil);
  if (earliest > now) {
    await wait(earliest - now);
  }
  let tries = 0;
  while (true) {
    try {
      const resposne = await client.post(endpoint, { query: query, variables: cleanVars(variables) });
      const remaining = Number(resposne.headers["x-ratelimit-remaining"]);
      if (!isNaN(remaining) && remaining <= 3) {
        cooldownUntil = Date.now() + 5000;
      }
      lastCall = Date.now();
      return checkBody(resposne.data);
    } catch (err) {
      if (err.statusCode) {
        throw err;
      }
      const status = err.response ? err.response.status : 0;
      if (status === 429 && tries < 2) {
        tries += 1;
        const heads = err.response.headers || {};
        const secs = Number(heads["retry-after"]);
        const pause = isNaN(secs) ? 60 : secs;
        await wait(pause * 1000);
        continue;
      }
      throw err;
    }
  }
}

export function anilistQuery(query, variables) {
  const job = queued.then(function () {
    return runQuery(query, variables);
  });
  queued = job.then(function () {}, function () {});
  return job;
}

const SEARCH_QUERY = "query ($page:Int,$perPage:Int,$search:String,$genre:String,$format:MediaFormat,$status:MediaStatus,$minScore:Int,$sort:[MediaSort]) { Page(page:$page, perPage:$perPage) { pageInfo { total currentPage lastPage hasNextPage perPage } media(type:ANIME, isAdult:false, search:$search, genre:$genre, format:$format, status:$status, averageScore_greater:$minScore, sort:$sort) { id title{romaji english native} coverImage{large extraLarge} averageScore episodes format status seasonYear genres } } }";

const GENRES_QUERY = "query { GenreCollection }";

const DETAIL_QUERY = `query ($id:Int) {
  Media(id:$id, type:ANIME) {
    id title{romaji english native} coverImage{large extraLarge} bannerImage
    trailer{id site} description(asHtml:false) averageScore popularity
    rankings{rank type allTime} episodes duration season seasonYear status format source
    startDate{year month day} endDate{year month day}
    studios(isMain:true){nodes{name}} genres tags{name isMediaSpoiler rank}
    characters(perPage:12, sort:[ROLE,RELEVANCE]){edges{role node{name{full} image{medium}} voiceActors(language:JAPANESE){name{full}}}}
    recommendations(perPage:8, sort:RATING_DESC){nodes{mediaRecommendation{id title{romaji english} coverImage{large}}}}
  }
}`;

export async function fetchAnimePage(vars) {
  const body = await anilistQuery(SEARCH_QUERY, vars);
  const page = body.data && body.data.Page ? body.data.Page : {};
  return page;
}

export async function fetchTopPage(page, perPage) {
  const result = await fetchAnimePage({ page: page || 1, perPage: perPage || 24, sort: ["TRENDING_DESC"] });
  return result;
}

export async function fetchGenreList() {
  const data = await anilistQuery(GENRES_QUERY, {});
  const list = data.data && data.data.GenreCollection ? data.data.GenreCollection : [];
  return list;
}

export async function fetchDetail(id) {
  const data = await anilistQuery(DETAIL_QUERY, { id: Number(id) });
  const media = data.data ? data.data.Media : null;
  return media;
}
