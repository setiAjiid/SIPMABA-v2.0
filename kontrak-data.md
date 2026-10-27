# Kontrak Data SIPMABA v2.0

Dokumen ini mencatat field, tipe data, validasi, dan alur yang ada di desain Figma, supaya frontend dan backend memakai bentuk data yang sama. Semua nilai contoh di desain (nama, akun, NIK, nomor) adalah data dummy dan tidak dipakai di aplikasi sungguhan.

Angka validasi dan penanda wajib diambil dari desain. Hal yang belum ditentukan di desain ditulis di bagian "Perlu disepakati" pada tiap bagian. Nama field memakai `snake_case` dan masih boleh diubah selama kita sepakat bersama.

## Desain di Figma

File: https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0

Page "Desain Antarmuka" adalah acuan untuk koding. Warna, tipografi, jarak, dan komponen pendukung ada di page "Design System".

| Bagian           | Isi                                                               | Tautan                                                                            |
| ---------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Desain Antarmuka | Seluruh page                                                      | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=72-10    |
| Design System    | Token, Text Style, ikon, komponen                                 | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=61-33    |
| 1. Komponen      | Button, Input, Form, Biodata, Shell                               | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1108 |
| 2. Beranda       | Beranda                                                           | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1109 |
| 3. Autentikasi   | Masuk, Daftar, Lupa kata sandi                                    | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1110 |
| 4. Biodata       | Pendidikan, Data Diri, Keluarga, Rumah, Catatan Khusus, Pendukung | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1111 |
| 5. Berkas        | Daftar Ulang, Unggah Berkas                                       | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1112 |
| 6. Analisis      | Uji dekripsi                                                      | https://www.figma.com/design/VDAc6Tq01Jg6ZNv5L1Ass5/SIPMABA-v2.0?node-id=122-1113 |

## 1. Alur utama

| Alur             | Langkah                                                                      | Hasil                                                                                               |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Daftar           | Isi nama pengguna, email, kata sandi, dan konfirmasi kata sandi, lalu kirim. | Akun dibuat, pengguna diarahkan ke halaman Masuk.                                                   |
| Masuk            | Isi nama pengguna dan kata sandi, lalu kirim.                                | Sesi dimulai, pengguna diarahkan ke Beranda.                                                        |
| Lupa kata sandi  | Isi email, lalu kirim.                                                       | Instruksi reset dikirim ke email.                                                                   |
| Simpan biodata   | Isi satu tab, lalu tekan Simpan.                                             | Data tab disimpan terenkripsi. Status tab menjadi "Tersimpan" beserta tanggalnya.                   |
| Unggah berkas    | Pilih atau tarik berkas ke kotak unggah.                                     | Berkas divalidasi, dienkripsi, lalu disimpan. Baris berkas menampilkan nama, ukuran, dan algoritma. |
| Unduh berkas     | Pilih algoritma (AES, DES, atau RC4), lalu tekan Unduh.                      | Berkas didekripsi dengan algoritma itu dan diunduh.                                                 |
| Lihat ciphertext | Tekan "Lihat ciphertext" pada baris berkas.                                  | Isi terenkripsi ditampilkan.                                                                        |
| Uji dekripsi     | Pilih berkas, isi jumlah percobaan, lalu tekan "Jalankan uji".               | Statistik waktu dekripsi tiap algoritma.                                                            |

## 2. Enkripsi

Yang sudah diterapkan:

- **In-transit.** `POST /api/handshake` (X25519), kunci sesi dari HKDF-SHA256 (salt `session_id`, info `my-go-api/v3`), lalu setiap permintaan dan respons dibungkus amplop AES-128-CTR + HMAC-SHA256 berisi `version`, `session_id`, `request_id` (sekali pakai, replay ditolak 409), `direction`, `iv`, `ciphertext`, dan `tag`. Sesi berlaku 15 menit. Untuk GET, amplop dikirim di header `X-Encrypted-Envelope` (JSON amplop dalam base64). Batas body amplop 1 MiB.
- **Berkas.** Setiap berkas dienkripsi dengan AES-256-CTR, DES-CTR, dan RC4 (kunci per berkas lewat HKDF dengan IV). Hanya ciphertext yang disimpan, beserta IV dan tag HMAC. Saat mengunduh, pengguna memilih algoritma. "Lihat ciphertext" menampilkan base64.
- **Biodata.** Kolom data pribadi disimpan sebagai ciphertext AES-256-CTR + HMAC (serializer GORM `enkripsi`). Kunci relasi, nomor pendaftaran, dan tanggal dibiarkan polos.
- **Kunci.** Kunci berkas dan biodata ada di variabel lingkungan server (`DATABASE_SECRET_AES256` 32 karakter, `DATABASE_SECRET_DES` 8 karakter, `DATABASE_SECRET_RC4`), sama untuk semua pengguna, dan tidak pernah dikirim ke browser. Ini berbeda dari rancangan awal (kunci diturunkan dari kata sandi pengguna), yang tidak diterapkan.

Batasan yang diketahui: kunci berkas juga dipakai sebagai kunci HMAC, dan DES serta RC4 sudah tidak dianggap aman. Keduanya dipakai karena diwajibkan tugas.

## 3. Autentikasi

| Field                   | Tipe   | Wajib                        | Validasi                                                             |
| ----------------------- | ------ | ---------------------------- | -------------------------------------------------------------------- |
| `nama_pengguna`         | string | Ya                           | Unik. Panjang dan karakter yang diizinkan belum ditentukan.          |
| `email`                 | string | Ya (Daftar, Lupa kata sandi) | Format email.                                                        |
| `kata_sandi`            | string | Ya                           | Panjang minimum belum ditentukan. Tidak disimpan sebagai teks biasa. |
| `konfirmasi_kata_sandi` | string | Ya (Daftar)                  | Sama dengan `kata_sandi`. Cukup divalidasi di frontend.              |

## 4. Beranda

Data yang ditampilkan:

- Nama pengguna dan nama tampilan.
- Status tiap tab biodata (Data Diri, Pendidikan, Keluarga, Rumah, Catatan Khusus, Pendukung): `tersimpan` atau `belum_diisi`, ditambah `tanggal_simpan` kalau sudah tersimpan.
- Jumlah berkas dan total ukurannya.
- Daftar metode enkripsi beserta mode dan panjang kunci.

## 5. Biodata

Tiap tab disimpan sendiri lewat tombol Simpan. Kolom validasi hanya memuat aturan yang terlihat di desain. Field tanpa aturan khusus tinggal mengikuti tipenya, dan apakah ia wajib diisi perlu ditegaskan per field.

### 5.1 Pendidikan

| Field              | Tipe         | Validasi                                                                                                                                                          |
| ------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provinsi_sekolah` | enum wilayah | Dipilih dari daftar provinsi.                                                                                                                                     |
| `kota_sekolah`     | enum wilayah | Mengikuti provinsi.                                                                                                                                               |
| `nama_sekolah`     | string       |                                                                                                                                                                   |
| `jurusan`          | string       | Contoh di desain: MIPA.                                                                                                                                           |
| `nisn`             | string       | 10 digit angka.                                                                                                                                                   |
| `tahun_masuk_smta` | int          | 4 digit.                                                                                                                                                          |
| `tahun_lulus_smta` | int          | 4 digit, tidak lebih kecil dari tahun masuk.                                                                                                                      |
| `nilai_tka`        | array        | Wajib untuk lulusan 2026. Tiap item berisi `mata_pelajaran` (string) dan `nilai` (desimal 0 sampai 100, satu angka di belakang koma). Boleh lebih dari satu item. |

### 5.2 Data Diri

| Field                                                   | Tipe         | Validasi                                                              |
| ------------------------------------------------------- | ------------ | --------------------------------------------------------------------- |
| `foto`                                                  | file         | JPG atau PNG, 400×400 px, maks 500 KB, latar biru, berpakaian formal. |
| `no_pendaftaran`                                        | string       | Dibuat sistem, hanya baca. Contoh: `SIPMABA-2026-000001`.             |
| `nama_ijazah`                                           | string       | Sesuai ijazah.                                                        |
| `nama_ktm`                                              | string       | Maks 20 karakter. Desain menampilkan penghitung karakter.             |
| `ukuran_almamater`                                      | enum         | Daftar ukuran belum ditentukan.                                       |
| `program_studi`                                         | string       |                                                                       |
| `jalur_masuk`                                           | string       |                                                                       |
| `periode_masuk`                                         | string       | Contoh: Semester Ganjil 2026/2027.                                    |
| `kewarganegaraan`                                       | string       |                                                                       |
| `nik`                                                   | string       | 16 digit angka. Pesan galat: "NIK harus 16 digit".                    |
| `no_paspor`                                             | string       | Opsional.                                                             |
| `status_pernikahan`                                     | enum         | Contoh: Belum menikah.                                                |
| `jenis_kelamin`                                         | enum         | `laki_laki` atau `perempuan`.                                         |
| `agama`                                                 | enum         |                                                                       |
| `tanggal_lahir`                                         | date         | `YYYY-MM-DD`.                                                         |
| `negara_lahir`, `provinsi_lahir`, `kota_lahir`          | enum wilayah |                                                                       |
| `tempat_lahir`                                          | string       | Sesuai KTP.                                                           |
| `alamat_ktp`                                            | string       |                                                                       |
| `negara_asal`, `provinsi_asal`, `kota_asal`             | enum wilayah |                                                                       |
| `kode_pos`                                              | string       | 5 digit.                                                              |
| `alamat_domisili`                                       | string       |                                                                       |
| `negara_domisili`, `provinsi_domisili`, `kota_domisili` | enum wilayah |                                                                       |
| `email`                                                 | string       | Format email.                                                         |
| `no_hp`                                                 | string       | Nomor WhatsApp.                                                       |
| `no_kip_k`                                              | string       | Contoh: `KIPK-2026-000001`.                                           |
| `no_bpjs`                                               | string       |                                                                       |
| `sumber_informasi`                                      | enum         | `website`, `media_sosial`, `teman`, `keluarga`, `sekolah`.            |
| `daftar_asrama`                                         | bool         |                                                                       |

### 5.3 Keluarga

Data ayah atau wali dan data ibu memakai bentuk yang sama.

| Field                                            | Tipe         | Validasi                                                                                      |
| ------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------- |
| `ayah.nik`, `ibu.nik`                            | string       | 16 digit angka.                                                                               |
| `ayah.nama`, `ibu.nama`                          | string       | Di desain, label ibu adalah "Nama ibu kandung".                                               |
| `*.tempat_lahir`                                 | string       |                                                                                               |
| `*.tanggal_lahir`                                | date         | `YYYY-MM-DD`.                                                                                 |
| `*.pekerjaan`                                    | string       |                                                                                               |
| `*.instansi`                                     | string       |                                                                                               |
| `*.pendidikan_terakhir`                          | enum         | Contoh: S1.                                                                                   |
| `*.no_hp`                                        | string       |                                                                                               |
| `*.status`                                       | enum         | `masih_hidup` atau `meninggal`.                                                               |
| `range_pendapatan_ortu`                          | enum         | Rentang per bulan, misalnya Rp5.000.001 sampai Rp10.000.000. Daftar rentang belum ditentukan. |
| `nomor_kk`                                       | string       | 16 digit angka.                                                                               |
| `jumlah_kakak`, `jumlah_adik`                    | int          | 0 atau lebih.                                                                                 |
| `alamat_ortu.alamat`                             | string       |                                                                                               |
| `alamat_ortu.rt`, `alamat_ortu.rw`               | string       | Angka, misalnya 003 dan 008.                                                                  |
| `alamat_ortu.kelurahan`, `alamat_ortu.kecamatan` | string       |                                                                                               |
| `alamat_ortu.provinsi`, `alamat_ortu.kota`       | enum wilayah |                                                                                               |
| `alamat_ortu.kode_pos`                           | string       | 5 digit.                                                                                      |
| `alamat_ortu.no_telepon_rumah`                   | string       |                                                                                               |

### 5.4 Rumah

| Field                 | Tipe | Validasi                                                |
| --------------------- | ---- | ------------------------------------------------------- |
| `kepemilikan`         | enum | Contoh: Milik sendiri.                                  |
| `tahun_perolehan`     | int  | 4 digit.                                                |
| `sumber_listrik`      | enum | Contoh: PLN 1.300 VA.                                   |
| `luas_tanah`          | int  | m², bilangan bulat tanpa titik.                         |
| `luas_bangunan`       | int  | m², bilangan bulat tanpa titik.                         |
| `njop`                | int  | Rupiah, bilangan bulat tanpa titik.                     |
| `mck`                 | enum | Mandi cuci kakus. Contoh: Milik sendiri di dalam rumah. |
| `sumber_air_minum`    | enum | Contoh: Air isi ulang.                                  |
| `jarak_pusat_kota_km` | int  | km, bilangan bulat tanpa titik.                         |
| `jumlah_penghuni`     | int  | Minimal 1.                                              |

### 5.5 Catatan Khusus

| Field                    | Tipe   | Validasi                   |
| ------------------------ | ------ | -------------------------- |
| `rencana_tempat_tinggal` | enum   | Contoh: Kos/Sewa.          |
| `ada_dukungan_keluarga`  | bool   |                            |
| `transportasi_dari_asal` | enum   | Contoh: Kendaraan umum.    |
| `transportasi_harian`    | enum   | Contoh: Kendaraan umum.    |
| `golongan_darah`         | enum   | A, B, AB, atau O.          |
| `rhesus`                 | enum   | `positif` atau `negatif`.  |
| `kondisi_kesehatan`      | string | Teks bebas. Data sensitif. |
| `disabilitas`            | bool   | Data sensitif.             |

Berkas di tab ini (JPG atau PNG, maks 500 KB):

| Kode             | Nama                            | Wajib |
| ---------------- | ------------------------------- | ----- |
| `ijazah_skl`     | Ijazah / Surat Keterangan Lulus | Ya    |
| `kartu_keluarga` | Kartu Keluarga                  | Ya    |
| `akta_kelahiran` | Akta Kelahiran                  | Ya    |
| `ktp`            | KTP                             | Ya    |
| `bpjs`           | BPJS / asuransi kesehatan       | Tidak |

### 5.6 Pendukung

Semua nilai uang bertipe `int` dalam rupiah.

| Field                                 | Tipe   | Validasi                           |
| ------------------------------------- | ------ | ---------------------------------- |
| `pekerjaan_ayah`, `pekerjaan_ibu`     | string |                                    |
| `penghasilan_ayah`, `penghasilan_ibu` | int    | Rp per bulan, kotor. 0 atau lebih. |
| `tanggungan_anak`                     | int    | Jumlah orang. 0 atau lebih.        |
| `tagihan_listrik`                     | int    | Rp per bulan.                      |
| `daya_listrik`                        | string | Contoh: 1300 VA.                   |
| `pajak_roda_dua`                      | int    | Rp. Boleh 0.                       |
| `pajak_roda_empat`                    | int    | Rp. Boleh 0.                       |
| `total_pbb`                           | int    | Rp.                                |

## 6. Berkas

Aturan umum: JPG atau PNG, maksimal 500 KB (tanpa batas minimum), kecuali disebutkan lain. Data yang disimpan untuk tiap berkas: `kode_berkas`, `nama_asli`, `ukuran_byte`, `tipe_mime`, `status` (`mengunggah` atau `terunggah`), `diunggah_pada`, dan hasil enkripsi untuk tiap algoritma.

### 6.1 Berkas Daftar Ulang

| Kode                        | Nama                                            | Wajib | Ketentuan tambahan                                         |
| --------------------------- | ----------------------------------------------- | ----- | ---------------------------------------------------------- |
| `foto_kipk_sktm`            | Foto KIP-K / SKTM                               | Tidak |                                                            |
| `rapor_sem_1_7`             | Rapor semester 1 sampai 7                       | Ya    |                                                            |
| `surat_tidak_menarik_biaya` | Surat Pernyataan Tidak Menarik Biaya Pendidikan | Ya    | Bermeterai Rp10.000, setiap surat memakai meterai berbeda. |
| `surat_tidak_memalsukan`    | Surat Pernyataan Tidak Memalsukan Dokumen       | Ya    | Bermeterai Rp10.000.                                       |
| `surat_kode_etik`           | Surat Pernyataan Kode Etik Mahasiswa            | Ya    | Bermeterai Rp10.000.                                       |
| `sertifikat_nilai_tka`      | Sertifikat dan nilai TKA                        | Tidak |                                                            |

Penghitung "0 dari 7 berkas" milik kotak Rapor: satu berkas per semester, dengan kode `rapor_sem_1` sampai `rapor_sem_7`.

### 6.2 Unggah Berkas

| Kelompok          | Kode                         | Nama                                       | Ketentuan tambahan              |
| ----------------- | ---------------------------- | ------------------------------------------ | ------------------------------- |
| Penghasilan       | `bukti_penghasilan_ortu`     | Bukti penghasilan orang tua (ayah dan ibu) |                                 |
| Penghasilan       | `surat_keterangan_pekerjaan` | Surat keterangan pekerjaan                 |                                 |
| Penghasilan       | `foto_aktivitas_ortu`        | Foto aktivitas orang tua saat bekerja      |                                 |
| Listrik dan pajak | `tagihan_listrik`            | Tagihan listrik                            |                                 |
| Listrik dan pajak | `bukti_pkb_roda_dua`         | Bukti PKB roda dua                         |                                 |
| Listrik dan pajak | `bukti_pkb_roda_empat`       | Bukti PKB roda empat                       |                                 |
| Listrik dan pajak | `pbb`                        | PBB                                        |                                 |
| Dokumen keluarga  | `kartu_keluarga`             | Kartu Keluarga                             |                                 |
| Dokumen keluarga  | `akta_kelahiran`             | Akta kelahiran                             |                                 |
| Foto rumah        | `foto_rumah_depan`           | Foto rumah tampak depan                    | Wajib geotag.                   |
| Foto rumah        | `foto_ruang_tamu`            | Foto ruang tamu                            | Wajib geotag.                   |
| Foto rumah        | `foto_kamar_mandi`           | Foto kamar mandi                           | Wajib geotag.                   |
| Foto rumah        | `foto_kamar_1`               | Foto kamar 1                               | Wajib geotag.                   |
| Foto rumah        | `foto_kamar_2`               | Foto kamar 2                               | Wajib geotag.                   |
| Lainnya           | `dokumen_lain`               | Dokumen                                    | PDF, DOC, atau XLS, maks 10 MB. |
| Lainnya           | `video_dokumentasi`          | Video dokumentasi                          | MP4 atau WebM, maks 100 MB.     |

Perlu disepakati:

- Kartu Keluarga dan Akta Kelahiran muncul di tab Catatan Khusus dan di halaman ini. Apakah itu berkas yang sama atau dua slot terpisah.
- Cara memeriksa geotag (membaca EXIF di server atau cukup dicek di frontend).

## 7. Analisis (uji dekripsi)

Masukan:

- `berkas_id`: berkas yang diuji, dipilih dari daftar berkas yang sudah terunggah.
- `jumlah_percobaan`: int. Contoh di desain: 20. Batas atasnya belum ditentukan.

Keluaran untuk tiap algoritma (AES, DES, RC4):

| Field                    | Tipe    | Keterangan                                     |
| ------------------------ | ------- | ---------------------------------------------- |
| `algoritma`              | enum    | `AES`, `DES`, `RC4`.                           |
| `mode`                   | string  | `AES-256-CBC`, `DES-CBC`, `RC4`.               |
| `rata_rata_ms`           | desimal | Rata-rata waktu dekripsi.                      |
| `median_ms`              | desimal |                                                |
| `simpangan_baku_ms`      | desimal | Dipakai untuk garis batas di grafik.           |
| `min_ms`, `maks_ms`      | desimal |                                                |
| `ukuran_ciphertext_byte` | int     |                                                |
| `selisih_ukuran_byte`    | int     | Selisih dari ukuran berkas asli, bisa negatif. |
| `mb_per_detik`           | desimal | Laju dekripsi.                                 |

Tombol "Salin sebagai tabel Markdown" cukup dikerjakan di frontend.

## 8. Endpoint

Semua di bawah `/api` dan dibungkus amplop terenkripsi (lihat bagian 2), kecuali `/handshake`. Galat memakai `{"message": "..."}` atau `{"error": "..."}`, dan galat validasi menambahkan rincian di `error`.

| Metode | Path | Fungsi |
| --- | --- | --- |
| POST | `/api/handshake` | Tukar kunci, buat sesi enkripsi. |
| POST | `/api/auth/daftar` | Buat akun (5 per menit per IP). |
| POST | `/api/auth/masuk` | Masuk, mengembalikan `data.token` (JWT, 5 per menit per IP). |
| POST | `/api/auth/keluar` | Keluar. |
| POST | `/api/auth/lupa_katasandi` | Selalu membalas pesan yang sama. |
| PUT | `/api/auth/ganti-katasandi` | Ganti kata sandi (perlu login). |
| GET | `/api/beranda` | Ringkasan status dan berkas. |
| GET | `/api/biodata/{tab}` | Ambil isi satu tab. |
| PUT | `/api/biodata/{tab}` | Simpan satu tab (seluruh isian tab). |
| GET | `/api/berkas` | Daftar berkas pengguna. |
| POST | `/api/berkas/{kode}` | Unggah berkas: `nama_asli`, `tipe_mime`, `isi_base64`. |
| GET | `/api/berkas/{id}/unduh?algoritma=AES` | Unduh hasil dekripsi (`isi_base64`). |
| GET | `/api/berkas/{id}/ciphertext?algoritma=AES` | Lihat ciphertext (base64). |
| DELETE | `/api/berkas/{id}` | Hapus berkas. |
| GET | `/api/analisis/berkas` | Berkas yang sudah terenkripsi tiga algoritma. |
| POST | `/api/analisis/uji-dekripsi` | `berkas_id`, `jumlah_percobaan` (1 sampai 100). |

`{tab}` bernilai `data-diri`, `pendidikan`, `keluarga`, `rumah`, `catatan-khusus`, atau `pendukung`.

Keputusan yang sudah diambil:

- Nilai pilihan dikirim dalam bentuk kontrak (`laki_laki`, `masih_hidup`, `positif`, `true`/`false` untuk Ya/Tidak); frontend memetakan teks tampilan.
- RT dan RW dikirim 3 digit; frontend menambahkan nol di depan.
- Sumber informasi satu pilihan.
- Nilai TKA boleh ditulis dengan koma (85,5) dan dikirim sebagai angka.
- Kartu Keluarga dan Akta Kelahiran di Catatan Khusus dan halaman Berkas memakai kode yang sama (satu berkas).
- Video (`video_dokumentasi`) MP4/WebM maks 10 MB lewat `POST /api/videos` lalu `PUT`/`GET /api/videos/{id}/chunks/{index}` (potongan 256 KB, `GET` dengan `?algoritma=`); tercatat di tabel berkas dan dihapus lewat `DELETE /api/berkas/{id}`.
- Dokumen (`dokumen_lain`) belum didukung; rencana batas 3 MB.

## 9. Rencana setelah tugas

Bagian ini hanya catatan untuk nanti. Untuk tugas, cukup bagian 1 sampai 8. Tiga hal berikut murah dikerjakan dari awal dan mahal kalau diubah belakangan:

1. Simpan `algoritma`, `versi_skema`, IV, salt, dan jumlah iterasi pada setiap data terenkripsi, supaya data lama tetap bisa dibuka setelah skema diperbarui.
2. Taruh semua proses enkripsi dan dekripsi di satu modul, sehingga mengganti algoritma tidak menyentuh halaman dan komponen.
3. Simpan kata sandi sebagai hash lambat berasin (Argon2id atau bcrypt).

Perluasan yang mungkin dilakukan sesudahnya: AES-GCM sebagai default (DES dan RC4 tetap ada untuk perbandingan di halaman Analisis), pengelolaan kunci lewat KMS, autentikasi dua faktor dan pembatasan percobaan masuk, pemindaian berkas yang diunggah, serta tautan unduh yang kedaluwarsa. Sebelum dipakai untuk data pendaftar sungguhan, aplikasi perlu ditinjau dari sisi keamanan dan kepatuhan pada UU Pelindungan Data Pribadi.
