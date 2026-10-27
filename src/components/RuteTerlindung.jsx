import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { cekSession } from "../lib/api";

export default function RuteTerlindung({ children }) {
  const [statusAutentikasi, setStatusAutentikasi] = useState(null);

  useEffect(() => {
    cekSession().then((isValid) => setStatusAutentikasi(isValid));
  }, []);

  if (statusAutentikasi === null) {
    return <div className="flex h-screen items-center justify-center">Memeriksa sesi...</div>;
  }

  if (!statusAutentikasi) return <Navigate to="/masuk" replace />;
  return children;
}
