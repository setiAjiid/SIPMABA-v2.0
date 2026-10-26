import { Routes, Route, Navigate } from "react-router-dom";
import Masuk from "./pages/Masuk";

export default function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<Masuk />} />
      <Route path="*" element={<Navigate to="/masuk" replace />} />
    </Routes>
  );
}
