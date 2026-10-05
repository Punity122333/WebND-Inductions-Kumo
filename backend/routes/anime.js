import express from "express";
import { fetchAnimePage, fetchTopPage, fetchGenreList, fetchDetail } from "../services/anilist.js";
import { getCache, setCache, makeKey } from "../utils/cache.js";
import { shapeList, shapePagination, shapeDetail, shapeCharacters, shapeRecommendations } from "../utils/shape.js";
import { toHttpError } from "../middleware/errorHandler.js";

const router = express.Router();

const allowedOrder = ["popularity", "score", "start_date", "title"];
const allowedTypes = ["tv", "movie", "ova", "special", "ona"];
const allowedStatus = ["airing", "complete", "upcoming"];

const formatMap = { tv: "TV", movie: "MOVIE", ova: "OVA", special: "SPECIAL", ona: "ONA" };
const statusMap = { airing: "RELEASING", complete: "FINISHED", upcoming: "NOT_YET_RELEASED" };

function parseSearch(q) {
  const out = {};
  out.q = q.q ? String(q.q) : "";
  out.page = q.page ? Number(q.page) : 1;
  out.genre = q.genre ? String(q.genre) : "";
  out.type = q.type ? String(q.type) : "";
  out.status = q.status ? String(q.status) : "";
  out.minScore = q.minScore !== undefined && q.minScore !== "" ? Number(q.minScore) : "";
  out.orderBy = q.orderBy ? String(q.orderBy) : "";
  out.sort = q.sort ? String(q.sort) : "desc";
  out.limit = q.limit ? Number(q.limit) : 24;
  return out;
}

function checkSearch(p) {
  if (!Number.isInteger(p.page) || p.page < 1) {
    return "page must be a positive integer";
  }
  if (p.minScore !== "" && (isNaN(p.minScore) || p.minScore < 0 || p.minScore > 10)) {
    return "minScore must be between 0 and 10";
  }
  if (p.orderBy && !allowedOrder.includes(p.orderBy)) {
    return "orderBy must be one of popularity, score, start_date, title";
  }
  if (p.sort && p.sort !== "asc" && p.sort !== "desc") {
    return "sort must be asc or desc";
  }
  if (p.limit && (!Number.isInteger(p.limit) || p.limit < 1 || p.limit > 25)) {
    return "limit must be between 1 and 25";
  }
  if (p.type && !allowedTypes.includes(p.type)) {
    return "type is not valid";
  }
  if (p.status && !allowedStatus.includes(p.status)) {
    return "status is not valid";
  }
  return null;
}

function buildSort(orderBy, sortDir, hasQ) {
  const dir = sortDir === "asc" ? "asc" : "desc";
  if (!orderBy) {
    if (hasQ) {
      return ["SEARCH_MATCH"];
    }
    return undefined;
  }
  if (orderBy === "popularity") {
    return [dir === "desc" ? "POPULARITY_DESC" : "POPULARITY"];
  }
  if (orderBy === "score") {
    return [dir === "desc" ? "SCORE_DESC" : "SCORE"];
  }
  if (orderBy === "start_date") {
    return [dir === "desc" ? "START_DATE_DESC" : "START_DATE"];
  }
  if (orderBy === "title") {
    return [dir === "desc" ? "TITLE_ROMAJI_DESC" : "TITLE_ROMAJI"];
  }
  return undefined;
}

router.get("/search", async function (req, res, next) {
  try {
    const p = parseSearch(req.query);
    const bad = checkSearch(p);
    if (bad) {
      const e = new Error(bad);
      e.statusCode = 400;
      throw e;
    }
    const cachKey = makeKey("search", p);
    const cached = getCache(cachKey);
    if (cached) {
      return res.json(cached);
    }
    const vars = {
      page: p.page,
      perPage: p.limit
    };
    if (p.q) {
      vars.search = p.q;
    }
    if (p.genre) {
      vars.genre = p.genre;
    }
    if (p.type && formatMap[p.type]) {
      vars.format = formatMap[p.type];
    }
    if (p.status && statusMap[p.status]) {
      vars.status = statusMap[p.status];
    }
    if (p.minScore !== "") {
      vars.minScore = Math.round(Number(p.minScore) * 10);
    }
    const sort = buildSort(p.orderBy, p.sort, !!p.q);
    if (sort) {
      vars.sort = sort;
    }
    const pageData = await fetchAnimePage(vars);
    const items = shapeList(pageData.media || []);
    const pagination = shapePagination(pageData.pageInfo || {}, p.limit);
    const payload = { items: items, pagination: pagination };
    setCache(cachKey, payload);
    res.json(payload);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e.statusCode ? e : e));
  }
});

router.get("/top", async function (req, res, next) {
  try {
    let currenPage = 1;
    if (req.query.page) {
      currenPage = Number(req.query.page);
    }
    if (!Number.isInteger(currenPage) || currenPage < 1) {
      const e = new Error("page must be a positive integer");
      e.statusCode = 400;
      throw e;
    }
    const cachKey = makeKey("top", { page: currenPage });
    const hit = getCache(cachKey);
    if (hit) {
      return res.json(hit);
    }
    const pageData = await fetchTopPage(currenPage, 24);
    const items = shapeList(pageData.media || []);
    const pagination = shapePagination(pageData.pageInfo || {}, 24);
    const body = { items: items, pagination: pagination };
    setCache(cachKey, body);
    res.json(body);
  } catch (e) {
    console.log("top anime failed", e.message);
    next(toHttpError(e.statusCode ? e : e));
  }
});

router.get("/genres", async function (req, res, next) {
  try {
    const hit = getCache("genres-all");
    if (hit) {
      return res.json(hit);
    }
    const list = await fetchGenreList();
    const kept = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i] !== "Hentai") {
        kept.push(list[i]);
      }
    }
    kept.sort();
    const mapped = kept.map(function (name) {
      return { id: name, name: name };
    });
    setCache("genres-all", mapped, 86400);
    res.json(mapped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

async function loadDetail(id) {
  const cachKey = "detail-" + id;
  const hit = getCache(cachKey);
  if (hit) {
    return hit;
  }
  const media = await fetchDetail(id);
  if (!media) {
    const e = new Error("Anime not found");
    e.statusCode = 404;
    throw e;
  }
  setCache(cachKey, media);
  return media;
}

router.get("/:id/characters", async function (req, res, next) {
  try {
    const media = await loadDetail(req.params.id);
    const shaped = shapeCharacters(media);
    res.json(shaped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

router.get("/:id/recommendations", async function (req, res, next) {
  try {
    const media = await loadDetail(req.params.id);
    const shaped = shapeRecommendations(media);
    res.json(shaped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const media = await loadDetail(req.params.id);
    const detail = shapeDetail(media);
    res.json(detail);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

export default router;
