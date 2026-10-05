export function shapeListItem(raw) {
  const imgs = raw.images || {};
  const jpg = imgs.jpg || {};
  const webp = imgs.webp || {};
  const pic = jpg.image_url || webp.image_url || jpg.small_image_url || null;
  const geners = raw.genres || [];
  const names = [];
  for (let i = 0; i < geners.length; i++) {
    if (geners[i] && geners[i].name) {
      names.push(geners[i].name);
    }
  }
  const item = {
    id: raw.mal_id,
    title: raw.title,
    titleEnglish: raw.title_english || null,
    image: pic,
    score: raw.score ?? null,
    episodes: raw.episodes ?? null,
    type: raw.type || null,
    status: raw.status || null,
    year: raw.year ?? null,
    genres: names
  };
  return item;
}

export function shapeList(arr) {
  const seen = new Set();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const one = shapeListItem(arr[i]);
    if (seen.has(one.id)) {
      continue;
    }
    seen.add(one.id);
    result.push(one);
  }
  const cleaned = result;
  return cleaned;
}

export function shapePagination(jikanPag) {
  const p = jikanPag || {};
  const curr = p.current_page || 1;
  const last = p.last_visible_page || 1;
  const hasMore = p.has_next_page || false;
  const total = p.items ? p.items.total || 0 : 0;
  const out = {
    currentPage: curr,
    lastPage: last,
    hasNextPage: hasMore,
    total: total
  };
  return out;
}

export function shapeDetail(raw) {
  const imgs = raw.images || {};
  const jpg = imgs.jpg || {};
  const pic = jpg.large_image_url || jpg.image_url || null;
  let trailerUrl = null;
  if (raw.trailer && raw.trailer.youtube_id) {
    trailerUrl = "https://www.youtube.com/embed/" + raw.trailer.youtube_id;
  }
  const geners = raw.genres || [];
  const genreNames = geners.map(function (g) {
    return g.name;
  });
  const themeList = raw.themes || [];
  const themeNames = [];
  for (const t of themeList) {
    themeNames.push(t.name);
  }
  const studioList = raw.studios || [];
  const studioNames = studioList.map(function (s) {
    return s.name;
  });
  let airedText = "";
  if (raw.aired && raw.aired.string) {
    airedText = raw.aired.string;
  }
  const detail = {
    id: raw.mal_id,
    title: raw.title,
    titleEnglish: raw.title_english || null,
    titleJapanese: raw.title_japanese || null,
    image: pic,
    trailerUrl: trailerUrl,
    synopsis: raw.synopsis || null,
    background: raw.background || null,
    score: raw.score ?? null,
    scoredBy: raw.scored_by ?? null,
    rank: raw.rank ?? null,
    popularity: raw.popularity ?? null,
    episodes: raw.episodes ?? null,
    duration: raw.duration || null,
    rating: raw.rating || null,
    season: raw.season || null,
    year: raw.year ?? null,
    status: raw.status || null,
    type: raw.type || null,
    source: raw.source || null,
    studios: studioNames,
    genres: genreNames,
    themes: themeNames,
    aired: airedText,
    related: raw.relations || []
  };
  return detail;
}

export function shapeCharacters(list) {
  const out = [];
  const slice = (list || []).slice(0, 12);
  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    const info = c.character || {};
    const imgs = info.images || {};
    const jpg = imgs.jpg || {};
    let actorName = null;
    const actors = c.voice_actors || [];
    for (let j = 0; j < actors.length; j++) {
      const a = actors[j];
      if (a.language === "Japanese") {
        actorName = a.person ? a.person.name : null;
        break;
      }
    }
    if (!actorName && actors.length > 0 && actors[0].person) {
      actorName = actors[0].person.name;
    }
    out.push({
      name: info.name || "Unknown",
      role: c.role || null,
      image: jpg.image_url || null,
      voiceActor: actorName
    });
  }
  return out;
}

export function shapeRecommendations(list) {
  const out = [];
  const slice = (list || []).slice(0, 8);
  for (const r of slice) {
    const e = r.entry || {};
    const imgs = e.images || {};
    const jpg = imgs.jpg || {};
    out.push({
      id: e.mal_id,
      title: e.title,
      image: jpg.image_url || null
    });
  }
  const filtered = out.filter(function (x) {
    return x.id;
  });
  return filtered;
}
