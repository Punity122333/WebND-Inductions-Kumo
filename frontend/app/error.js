"use client";

export default function AppError({ error, reset }) {
  const msg = error && error.message ? error.message : "Something broke";
  return (
    <div className="page">
      <h1>Something went wrong</h1>
      <p className="muted">{msg}</p>
      <button
        onClick={function () { reset(); }}
        style={{ background: "#ff8fb1", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 800 }}
      >
        Try again
      </button>
    </div>
  );
}
