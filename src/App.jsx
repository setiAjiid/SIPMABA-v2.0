import { Routes, Route, Navigate } from "react-router-dom";
import Masuk from "./pages/Masuk";
import Daftar from "./pages/Daftar";

export default function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/daftar" element={<Daftar />} />
      <Route path="*" element={<Navigate to="/masuk" replace />} />
    </Routes>
  );
}
