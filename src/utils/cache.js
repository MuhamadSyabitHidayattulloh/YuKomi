import * as FileSystem from 'expo-file-system';
import { getData, storeData } from './storage';

// Cache directory
const CACHE_DIR = `${FileSystem.documentDirectory}cache/`;
const IMAGES_CACHE_DIR = `${CACHE_DIR}images/`;
const CHAPTERS_CACHE_DIR = `${CACHE_DIR}chapters/`;

// Cache keys
const CACHE_KEYS = {
  IMAGE_CACHE_INDEX: '@YuKomi:image_cache_index',
  CHAPTER_CACHE_INDEX: '@YuKomi:chapter_cache_index',
  CACHE_SETTINGS: '@YuKomi:cache_settings',
};

// Default cache settings
const DEFAULT_CACHE_SETTINGS = {
  maxImageCacheSize: 500 * 1024 * 1024, // 500MB
  maxChapterCacheSize: 1024 * 1024 * 1024, // 1GB
  autoCleanup: true,
  cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Initialize cache directories
export const initializeCache = async () => {
  try {
    const cacheInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!cacheInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }

    const imagesCacheInfo = await FileSystem.getInfoAsync(IMAGES_CACHE_DIR);
    if (!imagesCacheInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_CACHE_DIR, { intermediates: true });
    }

    const chaptersCacheInfo = await FileSystem.getInfoAsync(CHAPTERS_CACHE_DIR);
    if (!chaptersCacheInfo.exists) {
      await FileSystem.makeDirectoryAsync(CHAPTERS_CACHE_DIR, { intermediates: true });
    }

    console.log('Cache directories initialized');
  } catch (error) {
    console.error('Error initializing cache:', error);
  }
};

// Get cache settings
export const getCacheSettings = async () => {
  try {
    const settings = await getData(CACHE_KEYS.CACHE_SETTINGS);
    return settings || DEFAULT_CACHE_SETTINGS;
  } catch (error) {
    console.error('Error getting cache settings:', error);
    return DEFAULT_CACHE_SETTINGS;
  }
};

// Update cache settings
export const updateCacheSettings = async (newSettings) => {
  try {
    const currentSettings = await getCacheSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await storeData(CACHE_KEYS.CACHE_SETTINGS, updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error('Error updating cache settings:', error);
    throw error;
  }
};

// === IMAGE CACHE MANAGEMENT ===

// Generate cache key for image
const generateImageCacheKey = (url) => {
  return url.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
};

// Get image cache index
const getImageCacheIndex = async () => {
  try {
    const index = await getData(CACHE_KEYS.IMAGE_CACHE_INDEX);
    return index || {};
  } catch (error) {
    console.error('Error getting image cache index:', error);
    return {};
  }
};

// Update image cache index
const updateImageCacheIndex = async (index) => {
  try {
    await storeData(CACHE_KEYS.IMAGE_CACHE_INDEX, index);
  } catch (error) {
    console.error('Error updating image cache index:', error);
  }
};

// Cache image
export const cacheImage = async (url) => {
  try {
    if (!url) return null;

    const cacheKey = generateImageCacheKey(url);
    const cachePath = `${IMAGES_CACHE_DIR}${cacheKey}`;
    
    // Check if already cached
    const fileInfo = await FileSystem.getInfoAsync(cachePath);
    if (fileInfo.exists) {
      return cachePath;
    }

    // Download and cache image
    const downloadResult = await FileSystem.downloadAsync(url, cachePath);
    
    if (downloadResult.status === 200) {
      // Update cache index
      const index = await getImageCacheIndex();
      index[url] = {
        cachePath,
        cacheKey,
        cachedAt: new Date().toISOString(),
        size: fileInfo.size || 0,
      };
      await updateImageCacheIndex(index);
      
      return cachePath;
    }
    
    return null;
  } catch (error) {
    console.error('Error caching image:', error);
    return null;
  }
};

// Get cached image path
export const getCachedImagePath = async (url) => {
  try {
    if (!url) return null;

    const index = await getImageCacheIndex();
    const cacheInfo = index[url];
    
    if (cacheInfo) {
      const fileInfo = await FileSystem.getInfoAsync(cacheInfo.cachePath);
      if (fileInfo.exists) {
        return cacheInfo.cachePath;
      } else {
        // Remove from index if file doesn't exist
        delete index[url];
        await updateImageCacheIndex(index);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};

// === CHAPTER CACHE MANAGEMENT ===

// Generate cache key for chapter
const generateChapterCacheKey = (comicEndpoint, chapterEndpoint) => {
  const comicKey = comicEndpoint.replace(/[^a-zA-Z0-9]/g, '_');
  const chapterKey = chapterEndpoint.replace(/[^a-zA-Z0-9]/g, '_');
  return `${comicKey}_${chapterKey}`;
};

// Get chapter cache index
const getChapterCacheIndex = async () => {
  try {
    const index = await getData(CACHE_KEYS.CHAPTER_CACHE_INDEX);
    return index || {};
  } catch (error) {
    console.error('Error getting chapter cache index:', error);
    return {};
  }
};

// Update chapter cache index
const updateChapterCacheIndex = async (index) => {
  try {
    await storeData(CACHE_KEYS.CHAPTER_CACHE_INDEX, index);
  } catch (error) {
    console.error('Error updating chapter cache index:', error);
  }
};

// Cache chapter
export const cacheChapter = async (comic, chapter, chapterData) => {
  try {
    const cacheKey = generateChapterCacheKey(comic.endpoint, chapter.endpoint);
    const chapterDir = `${CHAPTERS_CACHE_DIR}${cacheKey}/`;
    
    // Create chapter directory
    const dirInfo = await FileSystem.getInfoAsync(chapterDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(chapterDir, { intermediates: true });
    }

    // Cache chapter metadata
    const metadataPath = `${chapterDir}metadata.json`;
    const metadata = {
      comic,
      chapter,
      title: chapterData.title,
      cachedAt: new Date().toISOString(),
      imageCount: chapterData.image.length,
    };
    await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata));

    // Cache chapter images
    const cachedImages = [];
    for (let i = 0; i < chapterData.image.length; i++) {
      const imageUrl = chapterData.image[i];
      const imageName = `page_${i + 1}.jpg`;
      const imagePath = `${chapterDir}${imageName}`;
      
      try {
        const downloadResult = await FileSystem.downloadAsync(imageUrl, imagePath);
        if (downloadResult.status === 200) {
          cachedImages.push({
            originalUrl: imageUrl,
            cachePath: imagePath,
            pageNumber: i + 1,
          });
        }
      } catch (imageError) {
        console.error(`Error caching image ${i + 1}:`, imageError);
      }
    }

    // Update chapter cache index
    const index = await getChapterCacheIndex();
    index[`${comic.endpoint}_${chapter.endpoint}`] = {
      cacheKey,
      chapterDir,
      metadataPath,
      cachedImages,
      cachedAt: new Date().toISOString(),
      comic: {
        title: comic.title,
        endpoint: comic.endpoint,
      },
      chapter: {
        name: chapter.name,
        endpoint: chapter.endpoint,
      },
    };
    await updateChapterCacheIndex(index);

    return {
      success: true,
      cacheKey,
      cachedImages: cachedImages.length,
      totalImages: chapterData.image.length,
    };
  } catch (error) {
    console.error('Error caching chapter:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get cached chapter
export const getCachedChapter = async (comicEndpoint, chapterEndpoint) => {
  try {
    const index = await getChapterCacheIndex();
    const cacheInfo = index[`${comicEndpoint}_${chapterEndpoint}`];
    
    if (cacheInfo) {
      // Check if metadata file exists
      const metadataInfo = await FileSystem.getInfoAsync(cacheInfo.metadataPath);
      if (metadataInfo.exists) {
        const metadataContent = await FileSystem.readAsStringAsync(cacheInfo.metadataPath);
        const metadata = JSON.parse(metadataContent);
        
        // Verify cached images
        const validImages = [];
        for (const imageInfo of cacheInfo.cachedImages) {
          const imageFileInfo = await FileSystem.getInfoAsync(imageInfo.cachePath);
          if (imageFileInfo.exists) {
            validImages.push(imageInfo.cachePath);
          }
        }
        
        if (validImages.length > 0) {
          return {
            success: true,
            title: metadata.title,
            image: validImages,
            cachedAt: metadata.cachedAt,
          };
        }
      }
      
      // Remove invalid cache entry
      delete index[`${comicEndpoint}_${chapterEndpoint}`];
      await updateChapterCacheIndex(index);
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error getting cached chapter:', error);
    return { success: false };
  }
};

// === CACHE CLEANUP ===

// Get cache size
export const getCacheSize = async () => {
  try {
    const calculateDirSize = async (dirPath) => {
      let totalSize = 0;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      
      if (dirInfo.exists && dirInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(dirPath);
        for (const file of files) {
          const filePath = `${dirPath}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          
          if (fileInfo.isDirectory) {
            totalSize += await calculateDirSize(`${filePath}/`);
          } else {
            totalSize += fileInfo.size || 0;
          }
        }
      }
      
      return totalSize;
    };

    const imagesCacheSize = await calculateDirSize(IMAGES_CACHE_DIR);
    const chaptersCacheSize = await calculateDirSize(CHAPTERS_CACHE_DIR);
    
    return {
      totalSize: imagesCacheSize + chaptersCacheSize,
      imagesCacheSize,
      chaptersCacheSize,
    };
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return {
      totalSize: 0,
      imagesCacheSize: 0,
      chaptersCacheSize: 0,
    };
  }
};

// Clear image cache
export const clearImageCache = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(IMAGES_CACHE_DIR);
      await FileSystem.makeDirectoryAsync(IMAGES_CACHE_DIR, { intermediates: true });
    }
    
    // Clear image cache index
    await storeData(CACHE_KEYS.IMAGE_CACHE_INDEX, {});
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing image cache:', error);
    return { success: false, error: error.message };
  }
};

// Clear chapter cache
export const clearChapterCache = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CHAPTERS_CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CHAPTERS_CACHE_DIR);
      await FileSystem.makeDirectoryAsync(CHAPTERS_CACHE_DIR, { intermediates: true });
    }
    
    // Clear chapter cache index
    await storeData(CACHE_KEYS.CHAPTER_CACHE_INDEX, {});
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing chapter cache:', error);
    return { success: false, error: error.message };
  }
};

// Clear all cache
export const clearAllCache = async () => {
  try {
    const imageResult = await clearImageCache();
    const chapterResult = await clearChapterCache();
    
    return {
      success: imageResult.success && chapterResult.success,
      imageCache: imageResult,
      chapterCache: chapterResult,
    };
  } catch (error) {
    console.error('Error clearing all cache:', error);
    return { success: false, error: error.message };
  }
};

// Auto cleanup expired cache
export const cleanupExpiredCache = async () => {
  try {
    const settings = await getCacheSettings();
    const now = new Date().getTime();
    
    // Cleanup expired images
    const imageIndex = await getImageCacheIndex();
    const updatedImageIndex = {};
    
    for (const [url, cacheInfo] of Object.entries(imageIndex)) {
      const cachedAt = new Date(cacheInfo.cachedAt).getTime();
      if (now - cachedAt < settings.cacheExpiry) {
        // Check if file still exists
        const fileInfo = await FileSystem.getInfoAsync(cacheInfo.cachePath);
        if (fileInfo.exists) {
          updatedImageIndex[url] = cacheInfo;
        }
      } else {
        // Delete expired file
        try {
          await FileSystem.deleteAsync(cacheInfo.cachePath);
        } catch (deleteError) {
          console.error('Error deleting expired image:', deleteError);
        }
      }
    }
    
    await updateImageCacheIndex(updatedImageIndex);
    
    // Cleanup expired chapters
    const chapterIndex = await getChapterCacheIndex();
    const updatedChapterIndex = {};
    
    for (const [key, cacheInfo] of Object.entries(chapterIndex)) {
      const cachedAt = new Date(cacheInfo.cachedAt).getTime();
      if (now - cachedAt < settings.cacheExpiry) {
        // Check if directory still exists
        const dirInfo = await FileSystem.getInfoAsync(cacheInfo.chapterDir);
        if (dirInfo.exists) {
          updatedChapterIndex[key] = cacheInfo;
        }
      } else {
        // Delete expired directory
        try {
          await FileSystem.deleteAsync(cacheInfo.chapterDir);
        } catch (deleteError) {
          console.error('Error deleting expired chapter:', deleteError);
        }
      }
    }
    
    await updateChapterCacheIndex(updatedChapterIndex);
    
    return { success: true };
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    return { success: false, error: error.message };
  }
};

export default {
  initializeCache,
  getCacheSettings,
  updateCacheSettings,
  cacheImage,
  getCachedImagePath,
  cacheChapter,
  getCachedChapter,
  getCacheSize,
  clearImageCache,
  clearChapterCache,
  clearAllCache,
  cleanupExpiredCache,
};

