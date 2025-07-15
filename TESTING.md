# Testing Guide - YuKomi App

## Overview
Dokumen ini menjelaskan strategi testing untuk aplikasi YuKomi dan panduan untuk melakukan pengujian manual.

## Testing Strategy

### 1. Unit Testing
- **API Services**: Testing untuk semua fungsi di `src/api/komikku.js`
- **Utility Functions**: Testing untuk helper functions di `src/utils/helpers.js`
- **Storage Functions**: Testing untuk local storage operations di `src/utils/storage.js`

### 2. Component Testing
- **ComicCard**: Testing rendering dan interaksi
- **ChapterListItem**: Testing display dan navigation
- **SearchBar**: Testing input dan debounce functionality
- **LoadingSpinner**: Testing display states
- **ErrorMessage**: Testing error handling dan retry functionality

### 3. Integration Testing
- **Navigation Flow**: Testing navigasi antar screen
- **API Integration**: Testing integrasi dengan komikku-api
- **Local Storage**: Testing penyimpanan dan pengambilan data lokal

### 4. End-to-End Testing
- **User Journey**: Testing alur lengkap pengguna
- **Cross-Platform**: Testing di iOS dan Android
- **Performance**: Testing performa loading dan scrolling

## Manual Testing Checklist

### Home Screen
- [ ] Aplikasi berhasil dimuat tanpa error
- [ ] Komik populer ditampilkan dengan benar
- [ ] Komik rekomendasi ditampilkan dengan benar
- [ ] Komik terbaru ditampilkan dengan benar
- [ ] Pull-to-refresh berfungsi
- [ ] Navigasi ke detail komik berfungsi
- [ ] Loading state ditampilkan saat memuat data
- [ ] Error handling berfungsi jika API gagal

### Search Screen
- [ ] Search bar berfungsi dengan benar
- [ ] Debounce search berfungsi (tidak search setiap karakter)
- [ ] Hasil pencarian ditampilkan dengan benar
- [ ] Empty state ditampilkan jika tidak ada hasil
- [ ] Clear search berfungsi
- [ ] Loading state ditampilkan saat mencari
- [ ] Navigasi ke detail komik dari hasil pencarian berfungsi

### Comic Detail Screen
- [ ] Detail komik ditampilkan dengan lengkap
- [ ] Gambar thumbnail dimuat dengan benar
- [ ] Informasi komik (title, author, genre, status) ditampilkan
- [ ] Daftar chapter ditampilkan dengan benar
- [ ] Tombol favorit berfungsi (add/remove)
- [ ] Status favorit tersimpan dan ditampilkan dengan benar
- [ ] Navigasi ke chapter reader berfungsi
- [ ] Last read chapter ditandai dengan benar
- [ ] Loading dan error states berfungsi

### Chapter Reader Screen
- [ ] Gambar chapter dimuat dengan benar
- [ ] Scrolling vertikal berfungsi smooth
- [ ] Controls overlay bisa ditampilkan/disembunyikan
- [ ] Navigasi kembali berfungsi
- [ ] Informasi chapter dan komik ditampilkan
- [ ] Page counter ditampilkan dengan benar
- [ ] Navigation buttons (prev/next) berfungsi
- [ ] Status bar disembunyikan saat membaca
- [ ] Reading history terupdate otomatis

### Favorites Screen
- [ ] Daftar komik favorit ditampilkan
- [ ] Empty state ditampilkan jika belum ada favorit
- [ ] Counter jumlah favorit ditampilkan
- [ ] Pull-to-refresh berfungsi
- [ ] Navigasi ke detail komik berfungsi
- [ ] Data favorit persisten setelah restart app

### History Screen
- [ ] Daftar riwayat baca ditampilkan
- [ ] Empty state ditampilkan jika belum ada riwayat
- [ ] Informasi last read chapter ditampilkan
- [ ] Tanggal terakhir baca ditampilkan dengan format yang benar
- [ ] Tombol hapus dari riwayat berfungsi
- [ ] Counter jumlah riwayat ditampilkan
- [ ] Pull-to-refresh berfungsi
- [ ] Navigasi ke detail komik berfungsi

### Navigation
- [ ] Bottom tab navigation berfungsi
- [ ] Stack navigation berfungsi
- [ ] Back button berfungsi di semua screen
- [ ] Deep linking berfungsi (jika diimplementasi)
- [ ] Tab icons dan labels ditampilkan dengan benar

### Performance
- [ ] App startup time < 3 detik
- [ ] Image loading tidak blocking UI
- [ ] Smooth scrolling di semua list
- [ ] Memory usage stabil
- [ ] No memory leaks saat navigasi

### Error Handling
- [ ] Network error ditangani dengan baik
- [ ] API error ditampilkan dengan pesan yang jelas
- [ ] Retry functionality berfungsi
- [ ] Graceful degradation saat offline
- [ ] Invalid image URLs ditangani dengan placeholder

### Data Persistence
- [ ] Favorites tersimpan setelah restart
- [ ] Reading history tersimpan setelah restart
- [ ] Settings tersimpan setelah restart (jika ada)
- [ ] Data tidak hilang saat app di background

## Testing Tools

### Recommended Testing Libraries
```bash
# Unit Testing
npm install --save-dev jest @testing-library/react-native

# Component Testing
npm install --save-dev @testing-library/jest-native

# E2E Testing
npm install --save-dev detox
```

### Testing Commands
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e:ios
npm run e2e:android
```

## Bug Reporting Template

### Bug Report Format
```
**Bug Title**: [Deskripsi singkat bug]

**Environment**:
- Device: [iPhone 12, Samsung Galaxy S21, dll]
- OS Version: [iOS 15.0, Android 11, dll]
- App Version: [1.0.0]

**Steps to Reproduce**:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

**Expected Behavior**:
[Apa yang seharusnya terjadi]

**Actual Behavior**:
[Apa yang sebenarnya terjadi]

**Screenshots/Videos**:
[Lampirkan jika ada]

**Additional Notes**:
[Informasi tambahan]
```

## Performance Benchmarks

### Target Metrics
- **App Startup**: < 3 seconds
- **Screen Navigation**: < 500ms
- **Image Loading**: < 2 seconds per image
- **Search Response**: < 1 second
- **Memory Usage**: < 150MB on average

### Monitoring Tools
- React Native Performance Monitor
- Flipper for debugging
- Xcode Instruments (iOS)
- Android Studio Profiler (Android)

## Accessibility Testing

### Checklist
- [ ] Screen reader compatibility
- [ ] Proper contrast ratios
- [ ] Touch target sizes (minimum 44x44 points)
- [ ] Keyboard navigation support
- [ ] Voice control support

## Security Testing

### Checklist
- [ ] API keys tidak exposed di client
- [ ] HTTPS digunakan untuk semua API calls
- [ ] Input validation untuk search queries
- [ ] Safe image loading dari external URLs
- [ ] Local storage data encryption (jika diperlukan)

## Conclusion

Testing yang komprehensif memastikan aplikasi YuKomi berfungsi dengan baik di berbagai kondisi dan device. Ikuti checklist ini secara berkala untuk menjaga kualitas aplikasi.



## Testing Guide untuk Fitur Baru v2.0.0

### Cache System Testing

#### Image Cache Testing
- [ ] Gambar dimuat dari cache setelah pertama kali diakses
- [ ] Placeholder ditampilkan saat gambar gagal dimuat
- [ ] Cache size dihitung dengan benar di Settings
- [ ] Clear cache menghapus semua gambar cached
- [ ] Auto cleanup menghapus cache yang expired
- [ ] CachedImage component berfungsi di semua screen

#### Chapter Download Testing
- [ ] Download button muncul di setiap chapter
- [ ] Download progress ditampilkan dengan benar
- [ ] Chapter berhasil disimpan untuk offline reading
- [ ] Downloaded chapter dapat dibaca tanpa internet
- [ ] Download status persisten setelah restart app
- [ ] Error handling saat download gagal

#### Cache Management Testing
- [ ] Cache settings dapat diubah dan tersimpan
- [ ] Cache size monitoring akurat
- [ ] Manual cache cleanup berfungsi
- [ ] Cache directory structure benar
- [ ] File permissions untuk cache directory

### Notification System Testing

#### Permission Testing
- [ ] Request notification permission saat pertama kali
- [ ] Graceful handling jika permission ditolak
- [ ] Settings menampilkan status permission dengan benar
- [ ] Re-request permission dari Settings

#### Background Fetch Testing
- [ ] Background task terdaftar dengan benar
- [ ] Background fetch berjalan sesuai interval
- [ ] Pengecekan update chapter di background
- [ ] Notifikasi muncul untuk chapter baru
- [ ] Background task tidak crash aplikasi

#### Notification Content Testing
- [ ] Notifikasi chapter baru menampilkan info yang benar
- [ ] Tap notifikasi membuka aplikasi dengan benar
- [ ] Multiple notifications ditangani dengan baik
- [ ] Notification sound dan vibration berfungsi
- [ ] Notification channel (Android) terkonfigurasi benar

### Theme System Testing

#### Theme Switching Testing
- [ ] Light theme diterapkan dengan benar
- [ ] Dark theme diterapkan dengan benar
- [ ] Auto theme mengikuti system setting
- [ ] Theme persisten setelah restart app
- [ ] Real-time theme switching tanpa restart

#### Color Scheme Testing
- [ ] Semua 6 color scheme dapat dipilih
- [ ] Color scheme diterapkan ke semua komponen
- [ ] Color scheme persisten setelah restart
- [ ] Color picker modal berfungsi dengan benar
- [ ] Reset theme mengembalikan ke default

#### Component Theming Testing
- [ ] Header menggunakan theme colors
- [ ] Cards menggunakan theme colors
- [ ] Buttons menggunakan theme colors
- [ ] Text menggunakan theme colors
- [ ] Status bar color sesuai theme

### Settings Screen Testing

#### Navigation Testing
- [ ] Settings tab muncul di bottom navigation
- [ ] Settings screen dapat diakses
- [ ] Back navigation dari Settings berfungsi
- [ ] Settings icon ditampilkan dengan benar

#### Settings Functionality Testing
- [ ] Theme settings dapat diubah
- [ ] Cache settings dapat diubah
- [ ] Notification settings dapat diubah
- [ ] Reset settings berfungsi dengan benar
- [ ] Settings tersimpan dan persisten

#### UI/UX Testing
- [ ] Settings layout responsive
- [ ] Switch components berfungsi
- [ ] Modal dialogs berfungsi
- [ ] Loading states ditampilkan
- [ ] Error messages informatif

### Performance Testing

#### Memory Usage Testing
- [ ] Memory usage stabil dengan cache
- [ ] No memory leaks saat download chapter
- [ ] Efficient image loading dan disposal
- [ ] Background task tidak excessive memory usage

#### Storage Testing
- [ ] Cache tidak melebihi batas yang ditentukan
- [ ] Storage cleanup berfungsi otomatis
- [ ] File system operations tidak blocking UI
- [ ] Proper error handling untuk storage full

#### Network Testing
- [ ] Graceful handling saat offline
- [ ] Cache digunakan saat network unavailable
- [ ] Background sync berhenti saat no network
- [ ] Network error recovery

### Integration Testing

#### Cross-Feature Testing
- [ ] Download chapter + offline reading
- [ ] Theme switching + cached images
- [ ] Notifications + favorites integration
- [ ] Settings changes + app behavior

#### Data Persistence Testing
- [ ] All settings survive app restart
- [ ] Cache data persisten
- [ ] Notification settings persisten
- [ ] Theme preferences persisten

### Regression Testing

#### v1.0.0 Features Still Working
- [ ] Basic comic browsing
- [ ] Search functionality
- [ ] Favorites management
- [ ] Reading history
- [ ] Chapter reading
- [ ] Navigation between screens

#### Backward Compatibility
- [ ] Existing favorites data preserved
- [ ] Existing history data preserved
- [ ] No breaking changes in core functionality

### Device-Specific Testing

#### iOS Testing
- [ ] Background app refresh permission
- [ ] iOS notification permissions
- [ ] File system access
- [ ] Theme switching dengan iOS dark mode

#### Android Testing
- [ ] Background processing permissions
- [ ] Storage permissions
- [ ] Notification channels
- [ ] Android adaptive icons

### Edge Cases Testing

#### Low Storage Testing
- [ ] Graceful handling saat storage hampir penuh
- [ ] Auto cleanup saat storage low
- [ ] User notification untuk storage issues

#### Network Issues Testing
- [ ] Slow network handling
- [ ] Intermittent connectivity
- [ ] API timeout handling
- [ ] Retry mechanisms

#### Permission Edge Cases
- [ ] Permission revoked setelah granted
- [ ] Partial permissions granted
- [ ] Permission changes saat app running

### Automated Testing Recommendations

#### Unit Tests
```javascript
// Cache utility tests
describe('Cache Utils', () => {
  test('should cache image successfully', async () => {
    // Test implementation
  });
  
  test('should retrieve cached image', async () => {
    // Test implementation
  });
});

// Theme utility tests
describe('Theme Utils', () => {
  test('should switch theme correctly', async () => {
    // Test implementation
  });
});
```

#### Integration Tests
```javascript
// Settings screen tests
describe('Settings Screen', () => {
  test('should update theme setting', async () => {
    // Test implementation
  });
  
  test('should clear cache', async () => {
    // Test implementation
  });
});
```

### Performance Benchmarks v2.0.0

#### Target Metrics
- **App Startup**: < 3 seconds (sama dengan v1.0.0)
- **Image Loading**: < 1 second dengan cache
- **Chapter Download**: < 30 seconds untuk chapter rata-rata
- **Theme Switching**: < 200ms
- **Settings Screen Load**: < 500ms
- **Cache Operations**: < 100ms untuk operasi dasar

#### Memory Targets
- **Base Memory Usage**: < 150MB
- **With Cache**: < 200MB
- **During Download**: < 250MB
- **Background Tasks**: < 50MB additional

### Testing Tools dan Setup

#### Required Tools
```bash
# Testing dependencies
npm install --save-dev @testing-library/react-native
npm install --save-dev @testing-library/jest-native
npm install --save-dev jest

# E2E testing
npm install --save-dev detox
```

#### Test Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
  ],
};
```

### Conclusion

Testing untuk YuKomi v2.0.0 harus mencakup semua fitur baru sambil memastikan tidak ada regresi pada fitur existing. Fokus khusus pada cache system, notification system, dan theme management karena ini adalah fitur core yang baru ditambahkan.

