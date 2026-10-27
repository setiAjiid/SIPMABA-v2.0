import { useState } from "react";
import { Trash2 } from "lucide-react";
import Baris from "../../components/Baris";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { wilayah } from "../../data/wilayah";

const jurusan = ["MIPA", "IPS", "Bahasa", "SMK", "Lainnya"];
const tahun = Array.from({ length: 13 }, (_, i) => String(2015 + i));
const mapel = [
  "Matematika Tingkat Lanjut",
  "Bahasa Inggris Tingkat Lanjut",
  "Bahasa Indonesia",
  "Fisika",
  "Kimia",
  "Biologi",
];
const polaNilai = /^(100(\.0)?|\d{1,2}(\.\d)?)$/;

const awal = {
  provinsi: "",
  kota: "",
  sekolah: "",
  jurusan: "",
  nisn: "",
  masuk: "",
  lulus: "",
};

export default function Pendidikan() {
  const [form, setForm] = useState(awal);
  const [errors, setErrors] = useState({});
  const [tka, setTka] = useState([]);
  const [mapelBaru, setMapelBaru] = useState("");
  const [nilaiBaru, setNilaiBaru] = useState("");
  const [galatTka, setGalatTka] = useState("");

  function ubah(nama, nilai) {
    setForm((lama) => ({ ...lama, [nama]: nilai }));
  }

  function tambahTka() {
    if (!mapelBaru) {
      setGalatTka("Pilih mata pelajaran terlebih dahulu");
      return;
    }
    if (!polaNilai.test(nilaiBaru)) {
      setGalatTka("Nilai 0 sampai 100 dengan satu angka di belakang koma");
      return;
    }
    if (tka.some((t) => t.mapel === mapelBaru)) {
      setGalatTka("Mata pelajaran itu sudah ada dalam daftar");
      return;
    }
    setTka((lama) => [
      ...lama,
      { id: crypto.randomUUID(), mapel: mapelBaru, nilai: nilaiBaru },
    ]);
    setMapelBaru("");
    setNilaiBaru("");
    setGalatTka("");
  }

  function hapusTka(id) {
    setTka((lama) => lama.filter((t) => t.id !== id));
  }

  function simpan(e) {
    e.preventDefault();
    const baru = {};
    if (!form.provinsi) baru.provinsi = "Provinsi wajib dipilih";
    if (!form.kota) baru.kota = "Kota wajib dipilih";
    if (!form.sekolah.trim()) baru.sekolah = "Nama sekolah wajib diisi";
    if (!form.jurusan) baru.jurusan = "Jurusan wajib dipilih";
    if (!/^\d{10}$/.test(form.nisn)) baru.nisn = "NISN harus 10 digit angka";
    if (!form.masuk) baru.masuk = "Tahun masuk wajib dipilih";
    if (!form.lulus) baru.lulus = "Tahun lulus wajib dipilih";
    else if (form.masuk && Number(form.lulus) < Number(form.masuk))
      baru.lulus = "Tahun lulus tidak boleh lebih kecil dari tahun masuk";
    if (form.lulus === "2026" && tka.length === 0)
      baru.tka = "Nilai TKA wajib diisi untuk lulusan 2026";
    setErrors(baru);
    if (Object.keys(baru).length === 0) {
      console.log("Siap disimpan", {
        ...form,
        nilai_tka: tka.map((t) => ({
          mata_pelajaran: t.mapel,
          nilai: Number(t.nilai),
        })),
      });
    }
  }

  return (
    <form onSubmit={simpan} noValidate className="flex flex-col gap-6">
      <div className="divide-y divide-border rounded-xl border border-border bg-surface p-8">
        <section className="flex flex-col gap-6 pb-8">
          <h2 className="text-xl font-bold text-ink">Sekolah asal</h2>

          <Baris label="Asal sekolah" untuk="f-provinsi">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                id="f-provinsi"
                placeholder="Pilih provinsi"
                options={Object.keys(wilayah)}
                value={form.provinsi}
                onChange={(e) =>
                  setForm({ ...form, provinsi: e.target.value, kota: "" })
                }
                error={errors.provinsi}
              />
              <Select
                id="f-kota"
                placeholder="Pilih kota"
                options={wilayah[form.provinsi] ?? []}
                value={form.kota}
                onChange={(e) => ubah("kota", e.target.value)}
                disabled={!form.provinsi}
                error={errors.kota}
              />
            </div>
          </Baris>

          <Baris label="Nama sekolah" untuk="f-sekolah">
            <Input
              id="f-sekolah"
              value={form.sekolah}
              onChange={(e) => ubah("sekolah", e.target.value)}
              error={errors.sekolah}
            />
          </Baris>

          <Baris label="Jurusan" untuk="f-jurusan">
            <Select
              id="f-jurusan"
              options={jurusan}
              value={form.jurusan}
              onChange={(e) => ubah("jurusan", e.target.value)}
              error={errors.jurusan}
            />
          </Baris>

          <Baris label="NISN" untuk="f-nisn">
            <Input
              id="f-nisn"
              hint="10 digit"
              maxLength={10}
              inputMode="numeric"
              value={form.nisn}
              onChange={(e) => ubah("nisn", e.target.value)}
              error={errors.nisn}
            />
          </Baris>

          <Baris label="Tahun masuk SMTA" untuk="f-masuk">
            <Select
              id="f-masuk"
              options={tahun}
              value={form.masuk}
              onChange={(e) => ubah("masuk", e.target.value)}
              error={errors.masuk}
            />
          </Baris>

          <Baris label="Tahun lulus SMTA" untuk="f-lulus">
            <Select
              id="f-lulus"
              options={tahun}
              value={form.lulus}
              onChange={(e) => ubah("lulus", e.target.value)}
              error={errors.lulus}
            />
          </Baris>
        </section>

        <section className="flex flex-col gap-6 pt-8">
          <div>
            <h2 className="text-xl font-bold text-ink">Data TKA</h2>
            <p className="text-xs font-semibold text-muted">
              Wajib untuk lulusan 2026
            </p>
          </div>

          <Baris label="Mata pelajaran" untuk="f-mapel">
            <Select
              id="f-mapel"
              options={mapel}
              value={mapelBaru}
              onChange={(e) => setMapelBaru(e.target.value)}
            />
          </Baris>

          <Baris label="Nilai TKA" untuk="f-nilai">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  id="f-nilai"
                  inputMode="decimal"
                  value={nilaiBaru}
                  onChange={(e) => setNilaiBaru(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-12"
                onClick={tambahTka}
              >
                Tambah nilai
              </Button>
            </div>
          </Baris>

          {(galatTka || errors.tka) && (
            <p className="text-xs text-error md:pl-[252px]">
              {galatTka || errors.tka}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ink">Daftar nilai TKA</p>
            {tka.length === 0 ? (
              <p className="text-sm text-muted">Belum ada nilai TKA.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs font-semibold text-muted">
                    <tr>
                      <th className="px-4 py-3">Mata pelajaran</th>
                      <th className="px-4 py-3">Nilai</th>
                      <th className="w-12 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {tka.map((t) => (
                      <tr key={t.id} className="border-t border-border">
                        <td className="px-4 py-4 font-semibold text-ink">
                          {t.mapel}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {Number(t.nilai).toFixed(1)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => hapusTka(t.id)}
                            aria-label={`Hapus ${t.mapel}`}
                            className="text-error hover:opacity-70"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 -mx-8 flex justify-end border-t border-border bg-surface px-8 py-4">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
