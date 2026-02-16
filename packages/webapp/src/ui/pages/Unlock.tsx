import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVaultStore } from "../../store/vaultStore";

export default function Unlock() {
  const [password, setPassword] = useState("");
  const { unlock, isLoading, error } = useVaultStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await unlock(password);
    if (ok) navigate("/");
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: 8 }}>TGVault</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
        Zero-knowledge password manager
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="input"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          style={{ marginBottom: 16 }}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={isLoading} style={{ width: "100%", marginTop: 16 }}>
          {isLoading ? "Unlocking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
