# YuKomi - Aplikasi Baca Komik

YuKomi adalah aplikasi mobile untuk membaca komik berbahasa Indonesia yang dibangun dengan React Native dan Expo. Aplikasi ini menggunakan API dari [komikku-api](https://github.com/Romi666/komikku-api.git) untuk mengambil data komik.

## Fitur Utama

### Fitur yang Sudah Diimplementasi
- **Beranda**: Menampilkan komik populer, rekomendasi, dan komik terbaru
- **Pencarian**: Mencari komik berdasarkan judul
- **Detail Komik**: Melihat informasi lengkap komik termasuk daftar chapter
- **Pembaca Chapter**: Membaca komik dengan tampilan yang nyaman
- **Favorit**: Menyimpan komik favorit secara lokal
- **Riwayat Baca**: Melacak komik yang pernah dibaca dan chapter terakhir

### Fitur yang Akan Dikembangkan
- **Cache**: Menyimpan gambar komik secara lokal untuk akses offline
- **Notifikasi**: Pemberitahuan update chapter baru dari komik favorit
- **Pengaturan**: Theme dark/light mode, pengaturan pembaca, dll
- **Bookmark**: Menandai halaman tertentu dalam chapter
- **Download**: Mengunduh chapter untuk dibaca offline

## Struktur Proyek

```
YuKomi/
├── src/
│   ├── api/
│   │   └── komikku.js          # Service layer untuk API
│   ├── components/
│   │   ├── ComicCard.js        # Komponen kartu komik
│   │   ├── ChapterListItem.js  # Komponen item daftar chapter
│   │   ├── LoadingSpinner.js   # Komponen loading
│   │   ├── ErrorMessage.js     # Komponen pesan error
│   │   └── SearchBar.js        # Komponen pencarian
│   ├── navigation/
│   │   └── AppNavigator.js     # Konfigurasi navigasi
│   ├── screens/
│   │   ├── HomeScreen.js       # Layar beranda
│   │   ├── SearchScreen.js     # Layar pencarian
│   │   ├── FavoritesScreen.js  # Layar favorit
│   │   ├── HistoryScreen.js    # Layar riwayat
│   │   ├── ComicDetailScreen.js # Layar detail komik
│   │   └── ChapterReaderScreen.js # Layar pembaca chapter
│   ├── utils/
│   │   ├── storage.js          # Utility untuk local storage
│   │   └── helpers.js          # Utility helper functions
│   └── assets/                 # Asset gambar, ikon, dll
├── App.js                      # Komponen utama aplikasi
├── index.js                    # Entry point aplikasi
├── app.json                    # Konfigurasi Expo
├── babel.config.js             # Konfigurasi Babel
├── package.json                # Dependensi dan scripts
└── README.md                   # Dokumentasi proyek
```

## API Endpoints yang Digunakan

Aplikasi ini menggunakan semua endpoint yang tersedia dari komikku-api:

1. **GET /api/comic/list** - Mendapatkan daftar semua komik
2. **GET /api/comic/list?filter={type}** - Filter komik berdasarkan tipe (manga/manhwa/manhua)
3. **GET /api/comic/popular/page/{page}** - Mendapatkan komik populer
4. **GET /api/comic/recommended/page/{page}** - Mendapatkan komik rekomendasi
5. **GET /api/comic/newest/page/{page}** - Mendapatkan komik terbaru
6. **GET /api/comic/info/{endpoint}** - Mendapatkan detail komik
7. **GET /api/comic/search/{query}** - Mencari komik
8. **GET /api/comic/chapter/{endpoint}** - Mendapatkan detail chapter

## Instalasi dan Menjalankan

### Prasyarat
- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- Expo CLI

### Langkah Instalasi

1. Clone repositori ini
```bash
git clone <repository-url>
cd YuKomi
```

2. Install dependensi
```bash
npm install
```

3. Jalankan aplikasi
```bash
npm start
```

4. Scan QR code dengan Expo Go app di smartphone atau jalankan di emulator

### Dependensi Utama

- **React Native**: Framework untuk pengembangan mobile
- **Expo**: Platform untuk pengembangan React Native
- **React Navigation**: Library untuk navigasi
- **Axios**: HTTP client untuk API calls
- **AsyncStorage**: Local storage untuk React Native

## Pengembangan Selanjutnya

### Cache System
- Implementasi cache untuk gambar komik
- Penyimpanan chapter offline
- Manajemen storage space

### Notifikasi
- Push notification untuk update chapter baru
- Background sync untuk cek update
- Pengaturan notifikasi per komik

### Pengaturan
- Theme dark/light mode
- Pengaturan pembaca (brightness, zoom, dll)
- Pengaturan download dan cache
- Pengaturan notifikasi

### UI/UX Improvements
- Animasi dan transisi yang lebih smooth
- Gesture support untuk pembaca
- Infinite scroll untuk daftar komik
- Pull-to-refresh di semua screen

## Kontribusi

Proyek ini terbuka untuk kontribusi. Silakan buat issue atau pull request untuk perbaikan dan fitur baru.

## Lisensi

MIT License - lihat file LICENSE untuk detail lengkap.

