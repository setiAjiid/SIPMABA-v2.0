import { useSyncExternalStore } from "react";

// Pilihan tema disimpan per peramban. Tanpa pilihan, tema mengikuti
// pengaturan sistem. Nilai awal sudah dipasang oleh skrip di index.html
// sebelum React jalan, supaya halaman tidak berkedip terang.
const KUNCI = "sipmaba_tema";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const pendengar = new Set();

function pilihanTersimpan() {
  try {
    const nilai = localStorage.getItem(KUNCI);
    return nilai === "dark" || nilai === "light" ? nilai : null;
  } catch {
    return null;
  }
}

function pasang(tema) {
  document.documentElement.dataset.theme = tema;
  pendengar.forEach((fungsi) => fungsi());
}

const bacaTema = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

media.addEventListener("change", (e) => {
  if (!pilihanTersimpan()) pasang(e.matches ? "dark" : "light");
});

export function gantiTema() {
  const baru = bacaTema() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(KUNCI, baru);
  } catch {
    /* tetap berganti walau pilihan tidak dapat disimpan */
  }
  pasang(baru);
}

export function useTema() {
  return useSyncExternalStore(
    (fungsi) => {
      pendengar.add(fungsi);
      return () => pendengar.delete(fungsi);
    },
    bacaTema,
    () => "light",
  );
}
