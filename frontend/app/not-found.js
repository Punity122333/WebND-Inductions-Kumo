import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link href="/" style={{ color: "#c4899e", fontWeight: 800 }}>Go home</Link>
    </div>
  );
}
