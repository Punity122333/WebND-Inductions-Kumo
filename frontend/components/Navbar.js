"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "../context/FavoritesContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const ctx = useFavorites();
  const count = ctx ? ctx.favorites.length : 0;

  function linkCls(p) {
    if (pathname === p) {
      return styles.link + " " + styles.active;
    }
    return styles.link;
  }

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.kumo}>{"雲"}</span>
          <span className={styles.name}>Kumo</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={linkCls("/")}>Browse</Link>
          <Link href="/favorites" className={linkCls("/favorites")}>
            Favorites
            <span className={styles.badge}>{count}</span>
          </Link>
        </nav>
      </div>
      <div aria-hidden="true" className={styles.ticker}>
        <div className={styles.track}>
          <span>SEARCH ANIME / BOOKMARK STUFF / WATCH LATER / SEARCH ANIME / BOOKMARK STUFF / WATCH LATER /&nbsp;</span>
          <span>SEARCH ANIME / BOOKMARK STUFF / WATCH LATER / SEARCH ANIME / BOOKMARK STUFF / WATCH LATER /&nbsp;</span>
        </div>
      </div>
    </header>
  );
}
