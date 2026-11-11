# Guru Vokasi — Simulasi 3D Pendidikan Vokasi

Kumpulan simulasi 3D interaktif untuk pembelajaran **Teknik Otomasi Industri (TOI)** dan **Teknik Mesin** di SMK 2 Triple J Citeureup, Kabupaten Bogor.
Simulasi dapat dibuka langsung di browser (laptop maupun HP) tanpa instalasi.

🌐 **Halaman utama:** https://lht-sky.github.io/guruvokasi/

## Daftar Simulasi

| No | Simulasi | Kelompok | Tautan |
|----|----------|----------|--------|
| 1 | Kode Warna Resistor | Dasar Kelistrikan & Elektronika | [Buka](https://lht-sky.github.io/guruvokasi/simulasi-3D-kode-warna-resistor/) |
| 2 | Multimeter Digital | Dasar Kelistrikan & Elektronika | [Buka](https://lht-sky.github.io/guruvokasi/simulasi-3D-multimeter-digital/) |
| 3 | Hukum Ohm & Rangkaian Seri–Paralel | Dasar Kelistrikan & Elektronika | [Buka](https://lht-sky.github.io/guruvokasi/simulasi-3d-hukum-ohm/) |
| 4 | Panel DOL | Kendali Elektromagnetik | [Buka](https://lht-sky.github.io/guruvokasi/Simulasi_3D_Panel_DOL/) |
| 5 | Panel Forward–Reverse | Kendali Elektromagnetik | [Buka](https://lht-sky.github.io/guruvokasi/Simulasi_3D_Panel_Forward-Reverse/) |
| 6 | Panel Star–Delta | Kendali Elektromagnetik | [Buka](https://lht-sky.github.io/guruvokasi/Simulasi_3D_Panel_Star-Delta/) |
| 7 | Bengkel Aman TOI — K3LH & Budaya Kerja 5R | K3LH & Budaya Kerja | [Buka](https://lht-sky.github.io/guruvokasi/bengkel-aman-toi/) |
| 8 | Pabrik Elektronik Tycoon — DK1 Fase E | Game Tycoon | [Buka](https://lht-sky.github.io/guruvokasi/pabrik-tycoon/) |
| 9 | Pneumatik Tycoon — SKEH Fase F | Game Tycoon | [Buka](https://lht-sky.github.io/guruvokasi/pneumatik-tycoon/) |
| 10 | Studio Gamtek 3D — Pemantapan Gambar Teknik (Teknik Mesin kelas XI) | Gambar Teknik Mesin | [Buka](https://lht-sky.github.io/guruvokasi/studio-gamtek-tm/) |
| 11 | PKL Bengkel Las Maju Jaya — Fabrikasi Dasar, Pengukuran, Bor & Tap (Teknik Mesin, tahap 1) | Game Tycoon | [Buka](https://lht-sky.github.io/guruvokasi/pkl-bengkel-maju-jaya/) |

Segera hadir: Power Supply 24 VDC, Forward–Reverse Berbasis PLC (JS-PLC-01), Elektropneumatik 1 Silinder.

## Cara Menggunakan

- Buka tautan simulasi di browser (Chrome/Edge/Firefox terbaru disarankan).
- **Laptop:** klik-kiri + geser untuk memutar, scroll untuk zoom, klik-kanan + geser untuk menggeser tampilan.
- **HP/tablet:** geser satu jari untuk memutar, cubit dua jari untuk zoom.
- Diperlukan koneksi internet saat pertama kali dibuka (library 3D dimuat dari CDN).

## Tentang Pembuat

Nama saya **Lukman Hakim Tejosaputro**, guru vokasi di SMK 2 Triple J Citeureup, Kabupaten Bogor.

Saya berpengalaman 15 tahun di industri *special purpose machine*, *automation engineering*, dan *system integration*. Saya turut mengembangkan dan memproduksi kendaraan kebun **Wintor** dan kendaraan desa **AMMDes** yang diluncurkan di GIIAS 2019, mendampingi produksi shuttle minibus listrik **Metropod** dari MAB yang diperkenalkan di PEVS 2022, serta terlibat dalam program konversi ICE ke BEV pada Toyota Soluna 2005.

Kini saya terlibat langsung dalam upaya penguasaan dan kemandirian teknologi melalui pendidikan vokasi tingkat SMK. Media ini saya buat agar pembelajaran lebih menyenangkan dan mudah dipahami oleh murid-murid saya. Silakan dimanfaatkan semaksimal mungkin.

## Kontak

Kritik, saran, dan masukan silakan dikirim ke: **lukman.hakim5830@guru.smk.belajar.id**

---

### Catatan untuk pengelola repo: menambah simulasi baru

1. Buat folder baru (disarankan huruf kecil dan tanda hubung, mis. `simulasi-3d-power-supply-24vdc`), lalu simpan file simulasinya sebagai `index.html` di dalam folder itu.
2. Buka `index.html` di folder utama, cari bagian `const SIMULASI = [ ... ]`, lalu tambah/isi satu baris:
   ```js
   { judul:"Power Supply 24 VDC", folder:"simulasi-3d-power-supply-24vdc", kelompok:"Dasar Kelistrikan & Elektronika", ket:"Catu daya 24 VDC untuk panel kontrol." },
   ```
3. Tambahkan juga barisnya di tabel **Daftar Simulasi** pada README ini.
4. Commit & push — GitHub Pages akan memperbarui situs dalam 1–2 menit.

> Nama folder di URL **peka huruf besar/kecil**: `Simulasi_3D_Panel_DOL` ≠ `simulasi_3d_panel_dol`.
