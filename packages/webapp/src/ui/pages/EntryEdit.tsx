import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVaultStore } from "../../store/vaultStore";
import { copyToClipboard } from "../../utils/clipboard";
import { generateTOTP } from "@tgvault/crypto";

export default function EntryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEntry, addEntry, updateEntry, deleteEntry, sync } = useVaultStore();
  const entry = id && id !== "new" ? getEntry(id) : null;

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setUsername(entry.username);
      setPassword(entry.password);
      setUrl(entry.url);
      setNotes(entry.notes);
      setTotpSecret(entry.totpSecret);
    }
  }, [entry]);

  const handleSave = async () => {
    if (entry) {
      updateEntry(entry.id, { title, username, password, url, notes, totpSecret });
    } else {
      addEntry({ title, username, password, url, notes, totpSecret });
    }
    await sync();
    navigate("/");
  };

  const handleDelete = async () => {
    if (entry && confirm("Delete this entry?")) {
      deleteEntry(entry.id);
      await sync();
      navigate("/");
    }
  };

  const totpCode = totpSecret ? generateTOTP(totpSecret) : null;

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button className="btn" style={{ background: "transparent", color: "var(--text)" }} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>{entry ? "Edit entry" : "New entry"}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input className="input" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <textarea className="input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <input className="input" placeholder="TOTP secret (base32)" value={totpSecret} onChange={(e) => setTotpSecret(e.target.value)} />
        {totpCode && (
          <div className="card">
            <span>TOTP: </span>
            <strong style={{ fontFamily: "monospace", fontSize: 18 }}>{totpCode}</strong>
            <button
              className="btn"
              style={{ marginLeft: 12, padding: "6px 12px", fontSize: 14 }}
              onClick={() => copyToClipboard(totpCode)}
            >
              Copy
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button className="btn" onClick={handleSave} style={{ flex: 1 }}>
          Save
        </button>
        {entry && (
          <button className="btn" onClick={handleDelete} style={{ background: "var(--danger)" }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
