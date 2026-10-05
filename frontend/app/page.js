"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import GenreChips from "../components/GenreChips";
import AnimeGrid from "../components/AnimeGrid";
import { SkeletonGrid } from "../components/Skeleton";
import Pagination from "../components/Pagination";
import ErrorBox from "../components/ErrorBox";
import EmptyState from "../components/EmptyState";
import { searchAnime, getTopAnime, getGenres } from "../lib/api";
import styles from "./page.module.css";

function readFilters(sp) {
  return {
    q: sp.get("q") || "",
    page: sp.get("page") || "1",
    genre: sp.get("genre") || "",
    type: sp.get("type") || "",
    status: sp.get("status") || "",
    minScore: sp.get("minScore") || "",
    orderBy: sp.get("orderBy") || "",
    sort: sp.get("sort") || "desc"
  };
}

function Explorer() {
  const sp = useSearchParams();
  const router = useRouter();
  const filters = readFilters(sp);

  const [items, setItems] = useState([]);
  const [pag, setPag] = useState({ currentPage: 1, lastPage: 1, hasNextPage: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [genres, setGenres] = useState([]);
  const [tick, setTick] = useState(0);

  function push(next) {
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.page && next.page !== "1") p.set("page", next.page);
    if (next.genre) p.set("genre", next.genre);
    if (next.type) p.set("type", next.type);
    if (next.status) p.set("status", next.status);
    if (next.minScore) p.set("minScore", next.minScore);
    if (next.orderBy) p.set("orderBy", next.orderBy);
    if (next.sort && next.sort !== "desc") p.set("sort", next.sort);
    const qs = p.toString();
    router.replace(qs ? "/?" + qs : "/");
  }

  const onSearch = useCallback(function (v) {
    const next = { ...filters, q: v, page: "1" };
    push(next);
  }, [sp]);

  function onFilterUpdate(next) {
    const merged = { ...filters, ...next, page: "1" };
    push(merged);
  }

  function onReset() {
    router.replace("/");
  }

  function onPage(p) {
    const next = { ...filters, page: String(p) };
    push(next);
  }

  function onChip(id) {
    const next = { ...filters, genre: id, page: "1" };
    push(next);
  }

  useEffect(function () {
    let alive = true;
    async function run() {
      try {
        const res = await getGenres();
        if (alive) {
          setGenres(res);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    run();
    return function () {
      alive = false;
    };
  }, []);

  useEffect(function () {
    const ctrl = new AbortController();
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const hasFilter = filters.q || filters.genre || filters.type || filters.status || filters.minScore || filters.orderBy;
        let res;
        if (hasFilter) {
          res = await searchAnime({
            q: filters.q,
            page: filters.page,
            genre: filters.genre,
            type: filters.type,
            status: filters.status,
            minScore: filters.minScore,
            orderBy: filters.orderBy,
            sort: filters.sort,
            limit: 24
          }, ctrl.signal);
        } else {
          res = await getTopAnime(filters.page, ctrl.signal);
        }
        if (!ctrl.signal.aborted) {
          setItems(res.items || []);
          setPag(res.pagination || { currentPage: 1, lastPage: 1 });
          setLoading(false);
        }
      } catch (e) {
        if (e.name === "AbortError") {
          return;
        }
        console.error(e.message);
        setErr(e.message);
        setLoading(false);
      }
    }
    run();
    return function () {
      ctrl.abort();
    };
  }, [sp, tick]);

  const hasFilter = filters.q || filters.genre || filters.type || filters.status || filters.minScore || filters.orderBy;
  const heading = hasFilter ? "Results" : "Trending right now";

  return (
    <div className="page">
      <div className={styles.hero}>
        <h1 className={styles.title}>Find your next favorite anime</h1>
        <p className={styles.sub}>Search, filter and bookmark titles from MyAnimeList.</p>
      </div>
      <SearchBar value={filters.q} onChange={onSearch} />
      <div className={styles.chips}>
        <GenreChips genres={genres} activeGenre={filters.genre} onPick={onChip} />
      </div>
      <div className={styles.layout}>
        <aside className={styles.side}>
          <FilterPanel filters={filters} genres={genres} onUpdate={onFilterUpdate} onReset={onReset} />
        </aside>
        <section className={styles.results}>
          <h2 className="sectionTitle">{heading}</h2>
          {loading ? (
            <SkeletonGrid count={12} />
          ) : err ? (
            <ErrorBox message={err} onRetry={function () { setTick(tick + 1); }} />
          ) : items.length === 0 ? (
            <EmptyState onClear={onReset} />
          ) : (
            <>
              <AnimeGrid items={items} />
              <Pagination page={pag.currentPage} lastPage={pag.lastPage} onChange={onPage} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Explorer />
    </Suspense>
  );
}
