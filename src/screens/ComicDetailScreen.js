import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ChapterListItem from '../components/ChapterListItem';
import DownloadButton from '../components/DownloadButton';
import CachedImage from '../components/CachedImage';
import { getComicInfo } from '../api/komikku';
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getLastReadChapter,
  updateReadingHistory,
} from '../utils/storage';
import {
  getSafeImageUrl,
  getStatusBadge,
  formatGenres,
  formatRating,
} from '../utils/helpers';

const ComicDetailScreen = ({ route, navigation }) => {
  const { comic } = route.params;
  const [comicDetail, setComicDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [lastReadChapter, setLastReadChapter] = useState(null);

  useEffect(() => {
    loadComicDetail();
    checkFavoriteStatus();
    loadLastReadChapter();
  }, []);

  const loadComicDetail = async () => {
    try {
      setError(null);
      const response = await getComicInfo(comic.endpoint);
      
      if (response.success) {
        setComicDetail(response.data);
      } else {
        setError('Gagal memuat detail komik');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favStatus = await isFavorite(comic.endpoint);
      setIsFav(favStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const loadLastReadChapter = async () => {
    try {
      const lastChapter = await getLastReadChapter(comic.endpoint);
      setLastReadChapter(lastChapter);
    } catch (error) {
      console.error('Error loading last read chapter:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(comic.endpoint);
        setIsFav(false);
        Alert.alert('Berhasil', 'Komik dihapus dari favorit');
      } else {
        await addToFavorites(comic);
        setIsFav(true);
        Alert.alert('Berhasil', 'Komik ditambahkan ke favorit');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah status favorit');
    }
  };

  const navigateToChapter = async (chapter) => {
    try {
      // Update reading history
      await updateReadingHistory(comic, chapter.endpoint, chapter.name);
      
      // Navigate to chapter reader
      navigation.navigate('ChapterReader', {
        comic,
        chapter,
        chapterName: chapter.name,
      });
    } catch (error) {
      console.error('Error updating reading history:', error);
      // Tetap navigate meskipun gagal update history
      navigation.navigate('ChapterReader', {
        comic,
        chapter,
        chapterName: chapter.name,
      });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Memuat detail komik..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadComicDetail}
      />
    );
  }

  if (!comicDetail) {
    return (
      <ErrorMessage
        message="Detail komik tidak ditemukan"
        onRetry={loadComicDetail}
      />
    );
  }

  const statusBadge = getStatusBadge(comicDetail.status);
  const safeImageUrl = getSafeImageUrl(comicDetail.thumbnail);

  return (
    <ScrollView style={styles.container}>
      {/* Header dengan gambar dan info dasar */}
      <View style={styles.header}>
        <CachedImage
          source={{ uri: safeImageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{comicDetail.title}</Text>
          
          <View style={styles.metaInfo}>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
              <Text style={styles.statusText}>{statusBadge.text}</Text>
            </View>
            
            <Text style={styles.type}>{comicDetail.type}</Text>
          </View>
          
          {comicDetail.author && (
            <Text style={styles.author}>Oleh: {comicDetail.author}</Text>
          )}
          
          {comicDetail.rating && (
            <Text style={styles.rating}>
              Rating: {formatRating(comicDetail.rating)}
            </Text>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.favoriteButton, isFav && styles.favoriteButtonActive]}
          onPress={toggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={[styles.favoriteText, isFav && styles.favoriteTextActive]}>
            {isFav ? '❤️ Favorit' : '🤍 Tambah Favorit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Genre */}
      {comicDetail.genre && comicDetail.genre.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <Text style={styles.genreText}>
            {formatGenres(comicDetail.genre, 10)}
          </Text>
        </View>
      )}

      {/* Daftar Chapter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Daftar Chapter ({comicDetail.chapter_list?.length || 0})
        </Text>
        
        {comicDetail.chapter_list && comicDetail.chapter_list.length > 0 ? (
          <View style={styles.chapterList}>
            {comicDetail.chapter_list.map((chapter, index) => (
              <View key={index} style={styles.chapterItemContainer}>
                <ChapterListItem
                  chapter={chapter}
                  onPress={navigateToChapter}
                  isLastRead={
                    lastReadChapter && 
                    lastReadChapter.endpoint === chapter.endpoint
                  }
                  style={styles.chapterItem}
                />
                <DownloadButton
                  comic={comic}
                  chapter={chapter}
                  style={styles.downloadButton}
                />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noChaptersText}>
            Belum ada chapter tersedia
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 24,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  type: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  author: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#E74C3C',
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  favoriteTextActive: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  genreText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  chapterList: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  chapterItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterItem: {
    flex: 1,
  },
  downloadButton: {
    marginRight: 12,
  },
  noChaptersText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default ComicDetailScreen;

