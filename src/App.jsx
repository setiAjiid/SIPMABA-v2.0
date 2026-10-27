import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import RuteTamu from "./components/RuteTamu";
import RuteTerlindung from "./components/RuteTerlindung";
import Masuk from "./pages/Masuk";
import Daftar from "./pages/Daftar";
import LupaKataSandi from "./pages/LupaKataSandi";
import Beranda from "./pages/Beranda";
import Biodata from "./pages/Biodata";
import Berkas from "./pages/Berkas";
import Analisis from "./pages/Analisis";

export default function App() {
  return (
    <Routes>
      <Route
        path="/masuk"
        element={
          <RuteTamu>
            <Masuk />
          </RuteTamu>
        }
      />
      <Route
        path="/daftar"
        element={
          <RuteTamu>
            <Daftar />
          </RuteTamu>
        }
      />
      <Route
        path="/lupa-kata-sandi"
        element={
          <RuteTamu>
            <LupaKataSandi />
          </RuteTamu>
        }
      />
      <Route
        element={
          <RuteTerlindung>
            <AppLayout />
          </RuteTerlindung>
        }
      >
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/biodata" element={<Biodata />} />
        <Route path="/berkas" element={<Berkas />} />
        <Route path="/analisis" element={<Analisis />} />
      </Route>
      <Route path="*" element={<Navigate to="/masuk" replace />} />
    </Routes>
  );
}
