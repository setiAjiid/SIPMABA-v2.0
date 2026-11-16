import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Select from "../../components/Select";
import { JudulSeksi } from "../../components/berbagi/DaftarPengguna";
import { DialogKonfirmasi } from "../../components/berbagi/Dialog";
import KerangkaBerbagi, {
  TidakTersedia,
} from "../../components/berbagi/KerangkaBerbagi";
import KotakCentang from "../../components/berbagi/KotakCentang";
import {
  BarisRincian,
  ChipAlgoritma,
  KartuRincian,
  Kode,
} from "../../components/berbagi/Rincian";
import { KATEGORI_DATA } from "../../data/berbagi";
import { daftarUlang } from "../../data/berkas";
import { ambilNama } from "../../lib/api";
import {
  cariPengguna,
  kunciPenggunaContoh,
  ringkasData,
  salinTeks,
  setujuiPermintaan,
  unduhTeks,
  useBerbagi,
} from "../../lib/berbagi";
import { useDaftarBerkas } from "../../lib/berkas";
import { buatKunciBersama, bungkusKunci } from "../../lib/kunciBerbagi";
import { useStatusBiodata } from "../../lib/useStatusBiodata";

const KOTAK_MASUK = "/berbagi/kotak-masuk";
const MASA_BERLAKU = [1, 3, 7, 14, 30].map((hari) => ({
  nilai: String(hari),
  label: `${hari} hari`,
}));

function kategoriBerkas(kode) {
  if (kode === "video_dokumentasi") return "video";
  if (kode === "foto" || daftarUlang.some((b) => kode.startsWith(b.kode))) {
    return "berkas_daftar_ulang";
  }
  return "dokumen";
}

// Jumlah data milik pengguna ini per kategori; null selama memuat.
function useJumlahDataSaya() {
  const [biodata] = useStatusBiodata();
  const [berkas] = useDaftarBerkas();
  if (!biodata || !berkas) return null;
  const jumlah = {
    biodata: Object.values(biodata.status).filter((s) => s?.tersimpan).length,
    berkas_daftar_ulang: 0,
    dokumen: 0,
    video: 0,
  };
  for (const b of berkas.berkas) jumlah[kategoriBerkas(b.kode_berkas)] += 1;
  return jumlah;
}

function FormSetujui({ permintaan, peminta }) {
  const navigate = useNavigate();
  const idPaket = useId();
  const jumlah = useJumlahDataSaya();
  const [data, setData] = useState(permintaan.data);
  const [hari, setHari] = useState("7");
  // { sidik, sidikPenerima, paket } setelah kunci dibuat dan dibungkus.
  const [kunci, setKunci] = useState(null);
  const [galatKunci, setGalatKunci] = useState("");
  const [galatData, setGalatData] = useState("");
  const [info, setInfo] = useState("");
  const [terkirim, setTerkirim] = useState(false);
  const [tanya, setTanya] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const penerima = await kunciPenggunaContoh(peminta.nama_pengguna);
        const bersama = await buatKunciBersama();
        const paket = await bungkusKunci(bersama.mentah, penerima.publik);
        if (!batal) {
          setKunci({
            sidik: bersama.sidik,
            sidikPenerima: penerima.sidik,
            paket,
          });
        }
      } catch {
        if (!batal) {
          setGalatKunci(
            "Kunci tidak dapat dibuat di peramban ini. Muat ulang halaman untuk mencoba lagi.",
          );
        }
      }
    })();
    return () => {
      batal = true;
    };
  }, [peminta.nama_pengguna]);

  function alih(id) {
    setGalatData("");
    setData((lama) =>
      lama.includes(id) ? lama.filter((d) => d !== id) : [...lama, id],
    );
  }

  const pesanKirim = kunci
    ? `Paket kunci SIPMABA dari ${ambilNama() ?? "saya"} untuk ${peminta.nama}.\nSidik kunci: ${kunci.sidik}\n\n${kunci.paket}`
    : "";

  async function salin() {
    setTerkirim(true);
    setInfo(
      (await salinTeks(kunci.paket))
        ? "Paket kunci disalin."
        : "Tidak dapat menyalin otomatis. Pilih teks paket lalu salin secara manual.",
    );
  }

  function unduh() {
    setTerkirim(true);
    unduhTeks(`kunci-untuk-${peminta.nama_pengguna}.txt`, `${kunci.paket}\n`);
    setInfo("Berkas kunci diunduh.");
  }

  function simpan() {
    const terpilih = KATEGORI_DATA.map((k) => k.id).filter((k) =>
      data.includes(k),
    );
    const jumlahBerkas = terpilih
      .filter((k) => k !== "biodata")
      .reduce((total, k) => total + (jumlah?.[k] ?? 0), 0);
    setujuiPermintaan(permintaan.id, {
      data: terpilih,
      jumlah_berkas: jumlahBerkas,
      hari: Number(hari),
      sidik_kunci: kunci.sidik,
    });
    navigate(KOTAK_MASUK);
  }

  function setujui() {
    if (data.length === 0) {
      setGalatData("Pilih minimal satu data yang dibagikan.");
      return;
    }
    if (!terkirim) {
      setTanya(true);
      return;
    }
    simpan();
  }

  return (
    <KerangkaBerbagi
      sapaan="Kotak masuk"
      sapaanKe={KOTAK_MASUK}
      judul={`Setujui permintaan ${peminta.nama}`}
      keterangan={`Pilih data yang dibagikan. Sistem membuat kunci simetris, mengenkripsinya dengan kunci publik ${peminta.nama}, lalu Anda mengirimkannya lewat email atau WhatsApp.`}
      tab={false}
    >
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="1. Pilih data yang dibagikan"
          keterangan={`${peminta.nama} meminta ${ringkasData(permintaan).toLowerCase()}. Anda dapat membatasi isinya.`}
        />
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card">
          {permintaan.pesan && (
            <p className="rounded-lg bg-background px-4 py-3 text-sm leading-6 text-ink">
              <span className="font-semibold">Pesan dari {peminta.nama}:</span>{" "}
              {permintaan.pesan}
            </p>
          )}
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Data yang dibagikan</legend>
            {KATEGORI_DATA.map((k) => (
              <KotakCentang
                key={k.id}
                label={
                  jumlah
                    ? `${k.label} (${jumlah[k.id]} ${k.id === "biodata" ? "bagian" : "berkas"})`
                    : k.label
                }
                checked={data.includes(k.id)}
                onChange={() => alih(k.id)}
              />
            ))}
            {galatData && (
              <p role="alert" className="text-xs text-error">
                {galatData}
              </p>
            )}
          </fieldset>
          <Select
            label="Masa berlaku akses"
            options={MASA_BERLAKU}
            placeholder={null}
            value={hari}
            onChange={(e) => setHari(e.target.value)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="2. Kunci simetris dibuat"
          keterangan="Satu kunci baru untuk satu permintaan. Kunci tidak pernah tampil di layar."
        />
        <KartuRincian>
          <BarisRincian label="Algoritma" tebal>
            <ChipAlgoritma algoritma="AES" />
            AES-256
          </BarisRincian>
          <BarisRincian label="Cara dibuat">
            Dibuat acak oleh server untuk permintaan ini saja.
          </BarisRincian>
          <BarisRincian label="Sidik kunci">
            {kunci ? (
              <Kode>{kunci.sidik}</Kode>
            ) : (
              <span className="text-muted">
                {galatKunci ? "Tidak tersedia" : "Membuat kunci..."}
              </span>
            )}
          </BarisRincian>
          <BarisRincian label="Penyimpanan di server">
            Dibungkus kunci pengguna, lalu kunci pengguna dibungkus kunci utama
            server.
          </BarisRincian>
        </KartuRincian>
      </section>

      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul={`3. Kirim kunci ke ${peminta.nama}`}
          keterangan={`Kunci simetris dienkripsi dengan kunci publik ${peminta.nama}, jadi aman dikirim lewat saluran biasa.`}
        />
        <KartuRincian
          catatan={`Paket ini tidak dapat dibuka tanpa kunci pribadi ${peminta.nama}. Jangan kirim kata sandi atau kunci pribadi.`}
          tambahan={
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-2">
                <p id={idPaket} className="text-sm font-semibold text-ink">
                  Paket kunci terenkripsi
                </p>
                {galatKunci ? (
                  <p role="alert" className="text-sm text-error">
                    {galatKunci}
                  </p>
                ) : (
                  <p
                    aria-labelledby={idPaket}
                    className="rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    {kunci ? (
                      <Kode>{kunci.paket}</Kode>
                    ) : (
                      <span className="text-sm text-muted">
                        Mengenkripsi kunci dengan kunci publik penerima...
                      </span>
                    )}
                  </p>
                )}
              </div>
              {kunci && (
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={salin}>
                    Salin paket kunci
                  </Button>
                  <Button type="button" variant="secondary" onClick={unduh}>
                    Unduh berkas kunci
                  </Button>
                  <Button
                    variant="secondary"
                    href={`https://wa.me/?text=${encodeURIComponent(pesanKirim)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setTerkirim(true)}
                  >
                    Kirim lewat WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    href={`mailto:?subject=${encodeURIComponent("Paket kunci SIPMABA")}&body=${encodeURIComponent(pesanKirim)}`}
                    onClick={() => setTerkirim(true)}
                  >
                    Kirim lewat email
                  </Button>
                </div>
              )}
              {info && (
                <p role="status" className="text-xs text-muted">
                  {info}
                </p>
              )}
            </div>
          }
        >
          <BarisRincian label="Kunci publik penerima">
            {kunci ? (
              <Kode>{kunci.sidikPenerima}</Kode>
            ) : (
              <span className="text-muted">
                {galatKunci ? "Tidak tersedia" : "Memuat..."}
              </span>
            )}
          </BarisRincian>
          <BarisRincian label="Enkripsi asimetris">
            RSA-OAEP 2048 bit dengan SHA-256
          </BarisRincian>
        </KartuRincian>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button to={KOTAK_MASUK} variant="secondary">
          Batal
        </Button>
        <Button type="button" onClick={setujui} disabled={!kunci}>
          Setujui dan simpan kunci
        </Button>
      </div>

      {tanya && (
        <DialogKonfirmasi
          judul="Paket kunci belum dikirim"
          keterangan={`Anda belum menyalin, mengunduh, atau mengirim paket kunci. Setelah disetujui, paket tidak ditampilkan lagi dan ${peminta.nama} tidak dapat membuka data tanpa paket ini.`}
          labelSetuju="Setujui tanpa mengirim"
          labelBatal="Kembali ke paket"
          onSetuju={simpan}
          onTutup={() => setTanya(false)}
        />
      )}
    </KerangkaBerbagi>
  );
}

export default function SetujuiPermintaan() {
  const { id } = useParams();
  const { pengguna, masuk } = useBerbagi();
  const permintaan = masuk.find((p) => p.id === id);
  // Status dibaca sekali saat halaman dibuka, supaya formulir tidak hilang
  // sesaat ketika permintaan disetujui tepat sebelum pindah halaman.
  const [menunggu] = useState(permintaan?.status === "menunggu");

  if (!menunggu) {
    return (
      <KerangkaBerbagi
        sapaan="Kotak masuk"
      sapaanKe={KOTAK_MASUK}
        judul="Permintaan tidak tersedia"
        tab={false}
      >
        <TidakTersedia
          pesan="Permintaan ini tidak ditemukan atau sudah ditanggapi."
          kembali={KOTAK_MASUK}
          labelKembali="Kembali ke Kotak masuk"
        />
      </KerangkaBerbagi>
    );
  }

  return (
    <FormSetujui
      permintaan={permintaan}
      peminta={cariPengguna(pengguna, permintaan.peminta)}
    />
  );
}
