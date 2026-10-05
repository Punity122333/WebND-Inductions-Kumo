"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DetailHero from "../../../components/DetailHero";
import TrailerEmbed from "../../../components/TrailerEmbed";
import CharacterList from "../../../components/CharacterList";
import RecommendationList from "../../../components/RecommendationList";
import ErrorBox from "../../../components/ErrorBox";
import { SkeletonGrid } from "../../../components/Skeleton";
import { getAnimeDetail, getCharacters, getRecommendations } from "../../../lib/api";
import styles from "./detail.module.css";

export default function AnimePage({ params }) {
  const id = params.id;
  const sp = useSearchParams();
  const backQs = sp.toString();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [chars, setChars] = useState([]);
  const [charsErr, setCharsErr] = useState("");
  const [charsLoading, setCharsLoading] = useState(true);

  const [recs, setRecs] = useState([]);
  const [recsErr, setRecsErr] = useState("");
  const [recsLoading, setRecsLoading] = useState(true);

  const [tick, setTick] = useState(0);

  useEffect(function () {
    const ctrl = new AbortController();
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const res = await getAnimeDetail(id, ctrl.signal);
        if (!ctrl.signal.aborted) {
          setData(res);
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
  }, [id, tick]);

  useEffect(function () {
    const ctrl = new AbortController();
    async function run() {
      setCharsLoading(true);
      setCharsErr("");
      try {
        const res = await getCharacters(id, ctrl.signal);
        if (!ctrl.signal.aborted) {
          setChars(res);
          setCharsLoading(false);
        }
      } catch (e) {
        if (e.name === "AbortError") {
          return;
        }
        setCharsErr(e.message);
        setCharsLoading(false);
      }
    }
    run();
    return function () {
      ctrl.abort();
    };
  }, [id]);

  useEffect(function () {
    const ctrl = new AbortController();
    async function run() {
      setRecsLoading(true);
      setRecsErr("");
      try {
        const res = await getRecommendations(id, ctrl.signal);
        if (!ctrl.signal.aborted) {
          setRecs(res);
          setRecsLoading(false);
        }
      } catch (e) {
        if (e.name === "AbortError") {
          return;
        }
        setRecsErr(e.message);
        setRecsLoading(false);
      }
    }
    run();
    return function () {
      ctrl.abort();
    };
  }, [id]);

  return (
    <div className="page">
      <Link href={backQs ? "/?" + backQs : "/"} className={styles.back}>
        {"< Back to results"}
      </Link>
      {loading ? (
        <SkeletonGrid count={6} />
      ) : err ? (
        <ErrorBox message={err} onRetry={function () { setTick(tick + 1); }} />
      ) : data ? (
        <>
          <DetailHero anime={data} />
          <div className={styles.text}>
            <h2>Synopsis</h2>
            <p>{data.synopsis || "No synopsis available."}</p>
            {data.background ? (
              <>
                <h2>Background</h2>
                <p className={styles.muted}>{data.background}</p>
              </>
            ) : null}
            <p className={styles.meta}>
              {[data.source, data.duration, data.rating, data.aired].filter(Boolean).join(" · ")}
            </p>
          </div>
          <TrailerEmbed url={data.trailerUrl} />
          {charsLoading ? (
            <SkeletonGrid count={6} />
          ) : charsErr ? (
            <ErrorBox message={charsErr} onRetry={function () { window.location.reload(); }} />
          ) : (
            <CharacterList items={chars} />
          )}
          {recsLoading ? (
            <SkeletonGrid count={6} />
          ) : recsErr ? (
            <ErrorBox message={recsErr} onRetry={function () { window.location.reload(); }} />
          ) : (
            <RecommendationList items={recs} />
          )}
        </>
      ) : null}
    </div>
  );
}
