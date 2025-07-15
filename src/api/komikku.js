import axios from 'axios';

const BASE_URL = 'https://komiku-api.fly.dev/api';

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menangani response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

// Service untuk mendapatkan daftar komik
export const getComicList = async (filter = null) => {
  try {
    const url = filter ? `/comic/list?filter=${filter}` : '/comic/list';
    const response = await api.get(url);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil daftar komik');
  }
};

// Service untuk mendapatkan komik populer
export const getPopularComics = async (page = 1) => {
  try {
    const response = await api.get(`/comic/popular/page/${page}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil komik populer');
  }
};

// Service untuk mendapatkan komik yang direkomendasikan
export const getRecommendedComics = async (page = 1) => {
  try {
    const response = await api.get(`/comic/recommended/page/${page}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil komik rekomendasi');
  }
};

// Service untuk mendapatkan komik terbaru
export const getNewestComics = async (page = 1) => {
  try {
    const response = await api.get(`/comic/newest/page/${page}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil komik terbaru');
  }
};

// Service untuk mendapatkan informasi detail komik
export const getComicInfo = async (endpoint) => {
  try {
    const response = await api.get(`/comic/info${endpoint}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil informasi komik');
  }
};

// Service untuk mencari komik
export const searchComics = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await api.get(`/comic/search/${encodedQuery}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mencari komik');
  }
};

// Service untuk mendapatkan detail chapter
export const getChapterDetail = async (chapterEndpoint) => {
  try {
    const response = await api.get(`/comic/chapter${chapterEndpoint}`);
    return response;
  } catch (error) {
    throw new Error('Gagal mengambil detail chapter');
  }
};

// Export semua service sebagai default
export default {
  getComicList,
  getPopularComics,
  getRecommendedComics,
  getNewestComics,
  getComicInfo,
  searchComics,
  getChapterDetail,
};

