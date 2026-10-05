"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, addFavoriteApi, removeFavoriteApi } from "../lib/api";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(function () {
    let alive = true;
    async function load() {
      try {
        const data = await getFavorites();
        if (alive) {
          setFavorites(data);
          setLoaded(true);
        }
      } catch (err) {
        console.error(err.message);
        if (alive) {
          setLoaded(true);
        }
      }
    }
    load();
    return function () {
      alive = false;
    };
  }, []);

  function isFavorite(id) {
    for (let i = 0; i < favorites.length; i++) {
      if (String(favorites[i].id) === String(id)) {
        return true;
      }
    }
    return false;
  }

  async function addFavorite(item) {
    const prev = favorites;
    setFavorites([...prev, item]);
    try {
      const updated = await addFavoriteApi(item);
      setFavorites(updated);
    } catch (err) {
      console.error(err.message);
      setFavorites(prev);
    }
  }

  async function removeFavorite(id) {
    const prev = favorites;
    const kept = prev.filter(function (f) {
      return String(f.id) !== String(id);
    });
    setFavorites(kept);
    try {
      const updated = await removeFavoriteApi(id);
      setFavorites(updated);
    } catch (err) {
      console.error(err.message);
      setFavorites(prev);
    }
  }

  const value = { favorites: favorites, loaded: loaded, isFavorite: isFavorite, addFavorite: addFavorite, removeFavorite: removeFavorite };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  return ctx;
}
