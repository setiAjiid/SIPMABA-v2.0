import { Navigate } from "react-router-dom";
import { ambilToken } from "../lib/api";

export default function RuteTerlindung({ children }) {
  if (!ambilToken()) return <Navigate to="/masuk" replace />;
  return children;
}
