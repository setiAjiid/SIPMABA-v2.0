import { useState } from "react";
import Button from "../Button";
import InputKataSandi from "../InputKataSandi";
import { simpanKunci } from "../../lib/berbagi";
import { PANJANG_SANDI_MIN, buatPasanganKunci } from "../../lib/kunciBerbagi";

// Membuat pasangan kunci RSA baru dan menyimpannya dengan kunci pribadi
// terbungkus kata sandi. Dipakai untuk kunci pertama dan saat membuat ulang.
export default function FormBuatKunci({
  labelTombol = "Buat pasangan kunci",
  onSelesai,
  onBatal,
}) {
  const [sandi, setSandi] = useState("");
  const [ulang, setUlang] = useState("");
  const [galat, setGalat] = useState({});
  const [sibuk, setSibuk] = useState(false);

  async function buat(e) {
    e.preventDefault();
    const baru = {};
    if (sandi.length < PANJANG_SANDI_MIN) {
      baru.sandi = `Kata sandi minimal ${PANJANG_SANDI_MIN} karakter.`;
    }
    if (ulang !== sandi) baru.ulang = "Kata sandi tidak sama.";
    setGalat(baru);
    if (Object.keys(baru).length > 0) return;

    setSibuk(true);
    try {
      const kunci = await buatPasanganKunci(sandi);
      simpanKunci(kunci);
      onSelesai?.(kunci);
    } catch {
      setGalat({
        umum: "Pasangan kunci tidak dapat dibuat di peramban ini. Coba lagi.",
      });
      setSibuk(false);
    }
  }

  return (
    <form onSubmit={buat} noValidate className="flex flex-col gap-5">
      <InputKataSandi
        label="Kata sandi kunci pribadi"
        placeholder="Buat kata sandi kunci pribadi"
        autoComplete="new-password"
        value={sandi}
        onChange={(e) => setSandi(e.target.value)}
        error={galat.sandi}
        hint={`Minimal ${PANJANG_SANDI_MIN} karakter. Diminta setiap kali membuka paket kunci dan tidak dapat dipulihkan bila lupa.`}
      />
      <InputKataSandi
        label="Ulangi kata sandi"
        placeholder="Ketik ulang kata sandi"
        autoComplete="new-password"
        value={ulang}
        onChange={(e) => setUlang(e.target.value)}
        error={galat.ulang}
      />
      {galat.umum && (
        <p role="alert" className="text-sm text-error">
          {galat.umum}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onBatal && (
          <Button type="button" variant="secondary" onClick={onBatal}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={sibuk}>
          {sibuk ? "Membuat kunci..." : labelTombol}
        </Button>
      </div>
    </form>
  );
}
