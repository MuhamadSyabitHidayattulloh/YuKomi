import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys untuk AsyncStorage
const STORAGE_KEYS = {
  FAVORITES: '@YuKomi:favorites',
  READING_HISTORY: '@YuKomi:reading_history',
  SETTINGS: '@YuKomi:settings',
};

// Utility untuk menyimpan data
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

// Utility untuk mengambil data
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
};

// Utility untuk menghapus data
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// === FAVORITES MANAGEMENT ===

// Mendapatkan daftar komik favorit
export const getFavorites = async () => {
  try {
    const favorites = await getData(STORAGE_KEYS.FAVORITES);
    return favorites || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Menambahkan komik ke favorit
export const addToFavorites = async (comic) => {
  try {
    const favorites = await getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.endpoint === comic.endpoint);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, {
        ...comic,
        addedAt: new Date().toISOString(),
      }];
      await storeData(STORAGE_KEYS.FAVORITES, updatedFavorites);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Menghapus komik dari favorit
export const removeFromFavorites = async (endpoint) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.endpoint !== endpoint);
    await storeData(STORAGE_KEYS.FAVORITES, updatedFavorites);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Mengecek apakah komik ada di favorit
export const isFavorite = async (endpoint) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.endpoint === endpoint);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// === READING HISTORY MANAGEMENT ===

// Mendapatkan riwayat baca
export const getReadingHistory = async () => {
  try {
    const history = await getData(STORAGE_KEYS.READING_HISTORY);
    return history || [];
  } catch (error) {
    console.error('Error getting reading history:', error);
    return [];
  }
};

// Menambahkan atau memperbarui riwayat baca
export const updateReadingHistory = async (comic, chapterEndpoint, chapterName) => {
  try {
    const history = await getReadingHistory();
    const existingIndex = history.findIndex(item => item.endpoint === comic.endpoint);
    
    const historyItem = {
      ...comic,
      lastReadChapter: {
        endpoint: chapterEndpoint,
        name: chapterName,
      },
      lastReadAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = historyItem;
    } else {
      // Add new entry
      history.unshift(historyItem);
    }
    
    // Keep only last 50 items
    const limitedHistory = history.slice(0, 50);
    await storeData(STORAGE_KEYS.READING_HISTORY, limitedHistory);
    return true;
  } catch (error) {
    console.error('Error updating reading history:', error);
    throw error;
  }
};

// Menghapus item dari riwayat baca
export const removeFromHistory = async (endpoint) => {
  try {
    const history = await getReadingHistory();
    const updatedHistory = history.filter(item => item.endpoint !== endpoint);
    await storeData(STORAGE_KEYS.READING_HISTORY, updatedHistory);
    return true;
  } catch (error) {
    console.error('Error removing from history:', error);
    throw error;
  }
};

// Mendapatkan chapter terakhir yang dibaca untuk komik tertentu
export const getLastReadChapter = async (endpoint) => {
  try {
    const history = await getReadingHistory();
    const item = history.find(item => item.endpoint === endpoint);
    return item ? item.lastReadChapter : null;
  } catch (error) {
    console.error('Error getting last read chapter:', error);
    return null;
  }
};

// === SETTINGS MANAGEMENT ===

// Mendapatkan pengaturan aplikasi
export const getSettings = async () => {
  try {
    const settings = await getData(STORAGE_KEYS.SETTINGS);
    return settings || {
      theme: 'light', // 'light' | 'dark'
      readingMode: 'vertical', // 'vertical' | 'horizontal'
      autoBookmark: true,
      notifications: true,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      theme: 'light',
      readingMode: 'vertical',
      autoBookmark: true,
      notifications: true,
    };
  }
};

// Memperbarui pengaturan aplikasi
export const updateSettings = async (newSettings) => {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await storeData(STORAGE_KEYS.SETTINGS, updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export default {
  storeData,
  getData,
  removeData,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getReadingHistory,
  updateReadingHistory,
  removeFromHistory,
  getLastReadChapter,
  getSettings,
  updateSettings,
};

