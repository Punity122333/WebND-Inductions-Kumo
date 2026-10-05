import axios from "axios";

const baseUrl = process.env.JIKAN_BASE_URL || "https://api.jikan.moe/v4";

const client = axios.create({
  baseURL: baseUrl,
  timeout: 10000
});

let lastCall = 0;

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function throttle() {
  const now = Date.now();
  const gap = now - lastCall;
  if (gap < 350) {
    await wait(350 - gap);
  }
  lastCall = Date.now();
}

export async function jikanGet(path, params) {
  await throttle();
  let tries = 0;
  while (true) {
    try {
      const resposne = await client.get(path, { params: params });
      const payload = resposne.data;
      return payload;
    } catch (err) {
      const status = err.response ? err.response.status : 0;
      if (status === 429 && tries < 2) {
        tries += 1;
        await wait(1000);
        continue;
      }
      throw err;
    }
  }
}

export async function fetchAnimeList(params) {
  const data = await jikanGet("/anime", params);
  return data;
}

export async function fetchTopAnime(page) {
  const result = await jikanGet("/top/anime", { page: page || 1, limit: 24 });
  return result;
}

export async function fetchGenres() {
  const res = await jikanGet("/genres/anime", { filter: "genres" });
  return res;
}

export async function fetchAnimeById(id) {
  const data = await jikanGet("/anime/" + id + "/full", {});
  return data;
}

export async function fetchAnimeCharacters(id) {
  const result = await jikanGet("/anime/" + id + "/characters", {});
  return result;
}

export async function fetchAnimeRecs(id) {
  const res = await jikanGet("/anime/" + id + "/recommendations", {});
  return res;
}
