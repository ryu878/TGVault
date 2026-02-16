import { useNavigate } from "react-router-dom";
import { useVaultStore } from "../../store/vaultStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function Settings() {
  const navigate = useNavigate();
  const { lock, exportToFile } = useVaultStore();
  const { lockTimeoutMinutes, setLockTimeout, theme, setTheme } = useSettingsStore();

  return (
    <div className="page">
      <button className="btn" style={{ background: "transparent", color: "var(--text)", marginBottom: 20 }} onClick={() => navigate("/")}>
        ← Back
      </button>
      <h2>Settings</h2>
      <div className="card">
        <label style={{ display: "block", marginBottom: 8 }}>Auto-lock (minutes)</label>
        <select
          className="input"
          value={lockTimeoutMinutes}
          onChange={(e) => setLockTimeout(Number(e.target.value))}
        >
          {[1, 2, 5, 10, 15, 30].map((n) => (
            <option key={n} value={n}>{n} min</option>
          ))}
        </select>
      </div>
      <div className="card">
        <label style={{ display: "block", marginBottom: 8 }}>Theme</label>
        <select className="input" value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="card">
        <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", fontSize: 14 }}>
          Download an encrypted backup. Restore by importing on another device with the same master password.
        </p>
        <button className="btn" onClick={exportToFile} style={{ background: "var(--bg)" }}>
          Export backup
        </button>
      </div>
      <button className="btn" onClick={lock} style={{ marginTop: 20, background: "var(--danger)", width: "100%" }}>
        Lock vault
      </button>
    </div>
  );
}
