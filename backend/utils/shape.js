export function shapeScore(avg) {
  if (avg === null || avg === undefined) {
    return null;
  }
  const n = Math.round(Number(avg)) / 10;
  return n;
}

export function formatLabel(f) {
  if (!f) {
    return null;
  }
  if (f === "TV") {
    return "TV";
  }
  if (f === "TV_SHORT") {
    return "TV";
  }
  if (f === "MOVIE") {
    return "Movie";
  }
  if (f === "OVA") {
    return "OVA";
  }
  if (f === "ONA") {
    return "ONA";
  }
  if (f === "SPECIAL") {
    return "Special";
  }
  if (f === "MUSIC") {
    return "Music";
  }
  return f;
}

export function statusLabel(s) {
  if (s === "RELEASING") {
    return "Airing";
  }
  if (s === "FINISHED") {
    return "Finished";
  }
  if (s === "NOT_YET_RELEASED") {
    return "Upcoming";
  }
  if (s === "CANCELLED") {
    return "Cancelled";
  }
  if (s === "HIATUS") {
    return "Hiatus";
  }
  return s || null;
}

export function shapeListItem(m) {
  const t = m.title || {};
  const cover = m.coverImage || {};
  const geners = m.genres || [];
  const names = [];
  for (let i = 0; i < geners.length; i++) {
    if (geners[i]) {
      names.push(geners[i]);
    }
  }
  const item = {
    id: m.id,
    title: t.romaji || t.english || "Unknown",
    titleEnglish: t.english || null,
    image: cover.large || cover.extraLarge || null,
    score: shapeScore(m.averageScore),
    episodes: m.episodes ?? null,
    type: formatLabel(m.format),
    status: statusLabel(m.status),
    year: m.seasonYear ?? null,
    genres: names
  };
  return item;
}

export function shapeList(arr) {
  const seen = new Set();
  const result = [];
  for (let i = 0; i < (arr || []).length; i++) {
    const one = shapeListItem(arr[i]);
    if (seen.has(one.id)) {
      continue;
    }
    seen.add(one.id);
    let blocked = false;
    for (let j = 0; j < one.genres.length; j++) {
      if (one.genres[j] === "Hentai") {
        blocked = true;
        break;
      }
    }
    if (blocked) {
      continue;
    }
    result.push(one);
  }
  const cleaned = result;
  return cleaned;
}

export function shapePagination(pageInfo, perPage) {
  const p = pageInfo || {};
  const total = p.total || 0;
  let last = p.lastPage || 0;
  if (!last) {
    const per = perPage || 24;
    last = Math.ceil(total / per);
  }
  if (!last) {
    last = 1;
  }
  const out = {
    currentPage: p.currentPage || 1,
    lastPage: last,
    hasNextPage: !!p.hasNextPage,
    total: total
  };
  return out;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateText(d) {
  if (!d) {
    return "";
  }
  if (d.year && d.month && d.day) {
    return months[d.month - 1] + " " + d.day + ", " + d.year;
  }
  if (d.year && d.month) {
    return months[d.month - 1] + " " + d.year;
  }
  if (d.year) {
    return String(d.year);
  }
  return "";
}

function cleanText(html) {
  const txt = String(html || "");
  const withBreaks = txt.replace(/<br\s*\/?>/gi, "\n");
  const plain = withBreaks.replace(/<[^>]*>/g, "");
  const tidy = plain.trim();
  return tidy;
}

function capWord(s) {
  const low = String(s || "").toLowerCase().replace(/_/g, " ");
  if (!low) {
    return null;
  }
  return low.charAt(0).toUpperCase() + low.slice(1);
}

export function shapeDetail(m) {
  const media = m || {};
  const t = media.title || {};
  const cover = media.coverImage || {};
  let trailerUrl = null;
  if (media.trailer && media.trailer.site === "youtube" && media.trailer.id) {
    trailerUrl = "https://www.youtube.com/embed/" + String(media.trailer.id).trim();
  }
  let rank = null;
  const ranks = media.rankings || [];
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i].type === "RATED" && ranks[i].allTime) {
      rank = ranks[i].rank;
      break;
    }
  }
  const studioNodes = (media.studios && media.studios.nodes) || [];
  const studioNames = studioNodes.map(function (s) {
    return s.name;
  });
  const tagList = media.tags || [];
  const themes = [];
  for (let i = 0; i < tagList.length; i++) {
    if (!tagList[i].isMediaSpoiler && themes.length < 6) {
      themes.push(tagList[i].name);
    }
  }
  const start = dateText(media.startDate);
  const end = dateText(media.endDate);
  let airedText = start;
  if (start && end) {
    airedText = start + " to " + end;
  }
  const detail = {
    id: media.id,
    title: t.romaji || t.english || "Unknown",
    titleEnglish: t.english || null,
    titleJapanese: t.native || null,
    image: cover.extraLarge || cover.large || null,
    banner: media.bannerImage || null,
    trailerUrl: trailerUrl,
    synopsis: media.description ? cleanText(media.description) : null,
    background: null,
    score: shapeScore(media.averageScore),
    scoredBy: null,
    rank: rank,
    popularity: media.popularity ?? null,
    episodes: media.episodes ?? null,
    duration: media.duration ? media.duration + " min" : null,
    rating: null,
    season: media.season ? capWord(media.season) : null,
    year: media.seasonYear ?? null,
    status: statusLabel(media.status),
    type: formatLabel(media.format),
    source: media.source ? capWord(media.source) : null,
    studios: studioNames,
    genres: media.genres || [],
    themes: themes,
    aired: airedText,
    related: []
  };
  return detail;
}

function roleLabel(r) {
  if (!r) {
    return null;
  }
  const low = String(r).toLowerCase();
  return low.charAt(0).toUpperCase() + low.slice(1);
}

export function shapeCharacters(media) {
  const out = [];
  const edges = (media && media.characters && media.characters.edges) || [];
  const slice = edges.slice(0, 12);
  for (let i = 0; i < slice.length; i++) {
    const e = slice[i] || {};
    const node = e.node || {};
    const nm = node.name || {};
    const actors = e.voiceActors || [];
    let actorName = null;
    if (actors.length > 0 && actors[0].name) {
      actorName = actors[0].name.full || null;
    }
    out.push({
      name: nm.full || "Unknown",
      role: roleLabel(e.role),
      image: (node.image && node.image.medium) || null,
      voiceActor: actorName
    });
  }
  return out;
}

export function shapeRecommendations(media) {
  const out = [];
  const nodes = (media && media.recommendations && media.recommendations.nodes) || [];
  for (let i = 0; i < nodes.length && out.length < 8; i++) {
    const rec = nodes[i] ? nodes[i].mediaRecommendation : null;
    if (!rec) {
      continue;
    }
    const t = rec.title || {};
    const cover = rec.coverImage || {};
    out.push({
      id: rec.id,
      title: t.romaji || t.english || "Unknown",
      image: cover.large || null
    });
  }
  const result = out.filter(function (x) {
    return x.id;
  });
  return result;
}
