// Utility untuk memformat tanggal
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} minggu lalu`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} bulan lalu`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} tahun lalu`;
    }
  } catch (error) {
    return 'Tanggal tidak valid';
  }
};

// Utility untuk memformat judul komik
export const formatTitle = (title, maxLength = 50) => {
  if (!title) return '';
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
};

// Utility untuk memformat deskripsi
export const formatDescription = (description, maxLength = 100) => {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

// Utility untuk mendapatkan warna berdasarkan tipe komik
export const getComicTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'manga':
      return '#FF6B6B';
    case 'manhwa':
      return '#4ECDC4';
    case 'manhua':
      return '#45B7D1';
    default:
      return '#95A5A6';
  }
};

// Utility untuk mendapatkan badge berdasarkan status
export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return { color: '#2ECC71', text: 'Berlanjut' };
    case 'completed':
      return { color: '#3498DB', text: 'Selesai' };
    case 'hiatus':
      return { color: '#F39C12', text: 'Hiatus' };
    case 'dropped':
      return { color: '#E74C3C', text: 'Dibatalkan' };
    default:
      return { color: '#95A5A6', text: status || 'Tidak Diketahui' };
  }
};

// Utility untuk memvalidasi URL gambar
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
  } catch {
    return false;
  }
};

// Utility untuk mendapatkan placeholder image
export const getPlaceholderImage = () => {
  return 'https://via.placeholder.com/300x400/CCCCCC/FFFFFF?text=No+Image';
};

// Utility untuk memformat genre
export const formatGenres = (genres, maxGenres = 3) => {
  if (!genres || !Array.isArray(genres)) return '';
  
  const limitedGenres = genres.slice(0, maxGenres);
  let result = limitedGenres.join(', ');
  
  if (genres.length > maxGenres) {
    result += ` +${genres.length - maxGenres}`;
  }
  
  return result;
};

// Utility untuk debounce (untuk search)
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utility untuk mengekstrak ID dari endpoint
export const extractIdFromEndpoint = (endpoint) => {
  if (!endpoint) return '';
  return endpoint.replace(/^\/|\/$/g, '').replace(/\//g, '-');
};

// Utility untuk membuat URL gambar yang aman
export const getSafeImageUrl = (url) => {
  if (!url || !isValidImageUrl(url)) {
    return getPlaceholderImage();
  }
  return url;
};

// Utility untuk memformat rating
export const formatRating = (rating) => {
  if (!rating) return 'Belum ada rating';
  
  // Jika rating berupa angka
  if (typeof rating === 'number') {
    return `${rating.toFixed(1)}/10`;
  }
  
  // Jika rating berupa string (seperti "15 Tahun (minimal)")
  return rating;
};

// Utility untuk menghitung progress baca
export const calculateReadingProgress = (currentChapter, totalChapters) => {
  if (!currentChapter || !totalChapters || totalChapters === 0) {
    return 0;
  }
  
  // Ekstrak nomor chapter dari string
  const currentNum = parseInt(currentChapter.match(/\d+/)?.[0] || '0');
  const totalNum = parseInt(totalChapters.toString());
  
  return Math.min((currentNum / totalNum) * 100, 100);
};

// Utility untuk sorting
export const sortComics = (comics, sortBy = 'title') => {
  if (!Array.isArray(comics)) return [];
  
  return [...comics].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title?.localeCompare(b.title) || 0;
      case 'type':
        return a.type?.localeCompare(b.type) || 0;
      case 'recent':
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
      default:
        return 0;
    }
  });
};

export default {
  formatDate,
  formatTitle,
  formatDescription,
  getComicTypeColor,
  getStatusBadge,
  isValidImageUrl,
  getPlaceholderImage,
  formatGenres,
  debounce,
  extractIdFromEndpoint,
  getSafeImageUrl,
  formatRating,
  calculateReadingProgress,
  sortComics,
};

