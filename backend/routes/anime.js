import express from "express";
import { jikanGet, fetchAnimeList, fetchTopAnime, fetchGenres, fetchAnimeById, fetchAnimeCharacters, fetchAnimeRecs } from "../services/jikan.js";
import { getCache, setCache, makeKey } from "../utils/cache.js";
import { shapeList, shapePagination, shapeDetail, shapeCharacters, shapeRecommendations } from "../utils/shape.js";
import { toHttpError } from "../middleware/errorHandler.js";

const router = express.Router();

const allowedOrder = ["popularity", "score", "start_date", "title"];
const allowedTypes = ["tv", "movie", "ova", "special", "ona"];
const allowedStatus = ["airing", "complete", "upcoming"];

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
    const params = {
      page: p.page,
      limit: p.limit,
      sfw: true
    };
    if (p.q) params.q = p.q;
    if (p.genre) params.genres = p.genre;
    if (p.type) params.type = p.type;
    if (p.status) params.status = p.status;
    if (p.minScore !== "") params.min_score = p.minScore;
    if (p.orderBy) params.order_by = p.orderBy;
    if (p.sort) params.sort = p.sort;
    const raw = await fetchAnimeList(params);
    const list = raw.data || [];
    const items = shapeList(list);
    const pagination = shapePagination(raw.pagination);
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
    const raw = await fetchTopAnime(currenPage);
    const items = shapeList(raw.data || []);
    const pagination = shapePagination(raw.pagination);
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
    const raw = await fetchGenres();
    const arr = raw.data || [];
    const mapped = arr.map(function (g) {
      return { id: g.mal_id, name: g.name, count: g.count || 0 };
    });
    mapped.sort(function (a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    setCache("genres-all", mapped, 86400);
    res.json(mapped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

router.get("/:id/characters", async function (req, res, next) {
  try {
    const id = req.params.id;
    const cachKey = "chars-" + id;
    const hit = getCache(cachKey);
    if (hit) {
      return res.json(hit);
    }
    const raw = await fetchAnimeCharacters(id);
    const shaped = shapeCharacters(raw.data || []);
    setCache(cachKey, shaped);
    res.json(shaped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

router.get("/:id/recommendations", async function (req, res, next) {
  try {
    const id = req.params.id;
    const cachKey = "recs-" + id;
    const hit = getCache(cachKey);
    if (hit) {
      return res.json(hit);
    }
    const raw = await fetchAnimeRecs(id);
    const shaped = shapeRecommendations(raw.data || []);
    setCache(cachKey, shaped);
    res.json(shaped);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const cachKey = "detail-" + id;
    const hit = getCache(cachKey);
    if (hit) {
      return res.json(hit);
    }
    const raw = await fetchAnimeById(id);
    const detail = shapeDetail(raw.data || {});
    setCache(cachKey, detail);
    res.json(detail);
  } catch (e) {
    console.error(e.message);
    next(toHttpError(e));
  }
});

export default router;
