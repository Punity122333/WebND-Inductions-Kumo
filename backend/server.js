import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import animeRoutes from "./routes/anime.js";
import favRoutes from "./routes/favorites.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const prot = process.env.PORT || 5000;
const origin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: origin }));
app.use(express.json());

app.get("/health", function (req, res) {
  res.json({ ok: true });
});

app.use("/api/anime", animeRoutes);
app.use("/api/favorites", favRoutes);

app.use(function (req, res) {
  res.status(404).json({ error: true, message: "Route not found", status: 404 });
});

app.use(errorHandler);

app.listen(prot, function () {
  console.log("Kumo backend running on " + prot);
});
