const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function toQuery(params) {
  const parts = [];
  const keys = Object.keys(params || {});
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = params[k];
    if (v === "" || v === null || v === undefined) {
      continue;
    }
    parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  if (parts.length === 0) {
    return "";
  }
  return "?" + parts.join("&");
}

async function reqest(path, signal) {
  const url = API_BASE + path;
  const res = await fetch(url, { signal: signal });
  const body = await res.json();
  if (!res.ok) {
    const msg = body.message || "Request failed";
    throw new Error(msg);
  }
  return body;
}

export async function searchAnime(params, signal) {
  const qs = toQuery(params);
  const data = await reqest("/api/anime/search" + qs, signal);
  return data;
}

export async function getTopAnime(page, signal) {
  const p = page || 1;
  const result = await reqest("/api/anime/top?page=" + p, signal);
  return result;
}

export async function getGenres(signal) {
  const res = await fetch(API_BASE + "/api/anime/genres", { signal: signal });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load genres");
  }
  return data;
}

export async function getAnimeDetail(id, signal) {
  const url = API_BASE + "/api/anime/" + id;
  const res = await fetch(url, { signal: signal });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || "Failed to load anime");
  }
  return body;
}

export async function getCharacters(id, signal) {
  const data = await reqest("/api/anime/" + id + "/characters", signal);
  return data;
}

export async function getRecommendations(id, signal) {
  const data = await reqest("/api/anime/" + id + "/recommendations", signal);
  return data;
}

export async function getFavorites() {
  const res = await fetch(API_BASE + "/api/favorites");
  const data = await res.json();
  return data;
}

export async function addFavoriteApi(item) {
  const res = await fetch(API_BASE + "/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  const data = await res.json();
  return data;
}

export async function removeFavoriteApi(id) {
  const res = await fetch(API_BASE + "/api/favorites/" + id, { method: "DELETE" });
  const data = await res.json();
  return data;
}
