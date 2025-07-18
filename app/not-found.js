"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="__className_ee1788">
      <main data-sidebar="deactive">
        <div
          className="style_main__zYIqd"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem auto",
            maxWidth: 500,
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚧</div>
          <h1 className="text-white" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            404 - Page Not Found
          </h1>
          <p style={{ color: "#ccc", marginBottom: "2rem" }}>
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/dashboard">
            <button
              style={{
                background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
                color: "#232526",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 2rem",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "background 0.2s",
              }}
            >
              Go to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}