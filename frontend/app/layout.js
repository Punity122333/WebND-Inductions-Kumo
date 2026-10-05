import { Zen_Maru_Gothic, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { FavoritesProvider } from "../context/FavoritesContext";
import styles from "./layout.module.css";

const zen = Zen_Maru_Gothic({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-zen" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata = {
  title: "Kumo",
  description: "Smart anime explorer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={zen.variable + " " + nunito.variable}>
      <body>
        <FavoritesProvider>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <span>Kumo</span>
            <span className={styles.dot}>{" · "}</span>
            <span className={styles.muted}>Data by Jikan and MyAnimeList</span>
          </footer>
        </FavoritesProvider>
      </body>
    </html>
  );
}
