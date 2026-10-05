import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const here = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(here, "..", "data", "favorites.json");

function readFavs() {
  try {
    const txt = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(txt);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

function writeFavs(list) {
  const txt = JSON.stringify(list, null, 2);
  fs.writeFileSync(filePath, txt, "utf-8");
  const saved = readFavs();
  return saved;
}

router.get("/", function (req, res) {
  const favourties = readFavs();
  res.json(favourties);
});

router.post("/", function (req, res) {
  const body = req.body || {};
  if (!body.id) {
    return res.status(400).json({ error: true, message: "id is required", status: 400 });
  }
  const favourties = readFavs();
  let exists = false;
  for (let i = 0; i < favourties.length; i++) {
    if (String(favourties[i].id) === String(body.id)) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    const entry = {
      id: body.id,
      title: body.title || "Unknown",
      image: body.image || null,
      score: body.score ?? null,
      type: body.type || null,
      year: body.year ?? null
    };
    favourties.push(entry);
    const updated = writeFavs(favourties);
    return res.json(updated);
  }
  res.json(favourties);
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;
  const favourties = readFavs();
  const kept = favourties.filter(function (f) {
    return String(f.id) !== String(id);
  });
  const updated = writeFavs(kept);
  res.json(updated);
});

export default router;
