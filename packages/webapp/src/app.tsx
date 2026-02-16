import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Unlock from "./ui/pages/Unlock";
import Vault from "./ui/pages/Vault";
import EntryEdit from "./ui/pages/EntryEdit";
import Settings from "./ui/pages/Settings";
import { useVaultStore } from "./store/vaultStore";

export default function App() {
  const isUnlocked = useVaultStore((s) => s.isUnlocked);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unlock" element={<Unlock />} />
        <Route
          path="/"
          element={isUnlocked ? <Vault /> : <Navigate to="/unlock" replace />}
        />
        <Route
          path="/entry/new"
          element={isUnlocked ? <EntryEdit /> : <Navigate to="/unlock" replace />}
        />
        <Route
          path="/entry/:id"
          element={isUnlocked ? <EntryEdit /> : <Navigate to="/unlock" replace />}
        />
        <Route
          path="/settings"
          element={isUnlocked ? <Settings /> : <Navigate to="/unlock" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
