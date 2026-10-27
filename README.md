# SIPMABA v2.0 (frontend)

Frontend Sistem Informasi Penerimaan Mahasiswa Baru untuk tugas Keamanan
Informasi. React 19 + Vite + Tailwind CSS 4. Backend ada di repo terpisah,
[KI-Tugas-1](https://github.com/theRadn/KI-Tugas-1).

## Menjalankan

```
npm install
echo VITE_API_URL=http://localhost:8080/api > .env
npm run dev
```

Backend harus sudah berjalan (`go run main.go` di repo KI-Tugas-1).
`.env` diabaikan git.

## Fitur

- **Akun:** daftar, masuk, keluar, lupa kata sandi (pesan netral, tidak
  membocorkan email terdaftar). Halaman aplikasi hanya bisa dibuka setelah masuk.
- **Biodata:** enam tab (Data Diri, Pendidikan, Keluarga, Rumah, Catatan
  Khusus, Pendukung) dengan validasi, muat dan simpan per tab, serta status
  tersimpan di sidebar dan Beranda.
- **Berkas:** unggah gambar, daftar, hapus, unduh dengan AES, DES, atau RC4,
  dan lihat ciphertext. Rapor menampung 7 berkas. Video MP4/WebM (maks 10 MB)
  diunggah dan diunduh per potongan 256 KB. Dokumen belum didukung.
- **Analisis:** uji kecepatan dekripsi AES, DES, dan RC4 pada berkas sendiri,
  dengan grafik, tabel statistik, dan salin sebagai tabel Markdown.

## Keamanan di sisi klien

- **Enkripsi in-transit** (`src/lib/transit.js`): handshake X25519, kunci sesi
  diturunkan dengan HKDF-SHA256, lalu setiap permintaan dan respons dibungkus
  AES-128-CTR + HMAC-SHA256 dengan `request_id` sekali pakai. Respons yang
  gagal diverifikasi ditolak. GET mengirim amplop lewat header
  `X-Encrypted-Envelope` karena browser tidak mengizinkan body pada GET.
- **Pemanggil API tunggal** (`src/lib/api.js`): token JWT dan kunci sesi di
  `sessionStorage` (hilang saat tab ditutup), sesi enkripsi diperbarui otomatis,
  dan 401 dari token kedaluwarsa mengembalikan pengguna ke halaman masuk.
- Validasi di browser hanya untuk kenyamanan; backend memeriksa ulang semuanya.

## Struktur

| Folder | Isi |
| --- | --- |
| `src/lib` | `api.js`, `transit.js`, `biodata.js` (konversi form ke API), `berkas.js` |
| `src/components` | Komponen bersama (`FormKolom`, `FileDropzone`, `KartuBerkas`, ...) |
| `src/pages` | Halaman; `src/pages/biodata` berisi konfigurasi kolom tiap tab |
| `src/layouts` | `AuthLayout`, `AppLayout`, `SidebarLayout` |

Kontrak data antara frontend dan backend ada di `kontrak-data.md`.
