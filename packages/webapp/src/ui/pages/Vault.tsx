import { useState } from "react";
import { Link } from "react-router-dom";
import { useVaultStore } from "../../store/vaultStore";

export default function Vault() {
  const { vault, lock, sync } = useVaultStore();
  const [search, setSearch] = useState("");

  const entries = vault?.entries ?? [];
  const filtered = search
    ? entries.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.username.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Vault</h1>
        <div>
          <button className="btn" onClick={() => sync()} style={{ marginRight: 8 }}>
            Sync
          </button>
          <Link to="/settings">
            <button className="btn" style={{ background: "var(--bg-secondary)", color: "var(--text)" }}>
              Settings
            </button>
          </Link>
          <button className="btn" onClick={lock} style={{ marginLeft: 8, background: "var(--danger)" }}>
            Lock
          </button>
        </div>
      </div>
      <input
        type="text"
        className="input"
        placeholder="Search entries…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Link to="/entry/new">
        <button className="btn" style={{ width: "100%", marginBottom: 20 }}>
          + Add entry
        </button>
      </Link>
      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          {entries.length === 0 ? "No entries yet. Add one!" : "No matches."}
        </p>
      ) : (
        filtered.map((e) => (
          <Link key={e.id} to={`/entry/${e.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card" style={{ cursor: "pointer" }}>
              <strong>{e.title || "(Untitled)"}</strong>
              {e.username && (
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: 14 }}>
                  {e.username}
                </p>
              )}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
