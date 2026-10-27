import { Navigate } from "react-router-dom";
import { ambilToken } from "../lib/api";

// Halaman masuk dan daftar tidak perlu dibuka lagi oleh pengguna yang
// sudah masuk.
export default function RuteTamu({ children }) {
  if (ambilToken()) return <Navigate to="/beranda" replace />;
  return children;
}
