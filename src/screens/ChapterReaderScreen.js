import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CachedImage from '../components/CachedImage';
import { getChapterDetail } from '../api/komikku';
import { getCachedChapter } from '../utils/cache';
import { getSafeImageUrl } from '../utils/helpers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ChapterReaderScreen = ({ route, navigation }) => {
  const { comic, chapter, chapterName } = route.params;
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    loadChapterData();
    
    // Hide status bar for immersive reading
    StatusBar.setHidden(true);
    
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const loadChapterData = async () => {
    try {
      setError(null);
      
      // Try to get cached chapter first
      const cachedChapter = await getCachedChapter(comic.endpoint, chapter.endpoint);
      if (cachedChapter.success) {
        setChapterData(cachedChapter);
        setLoading(false);
        return;
      }
      
      // If not cached, fetch from API
      const response = await getChapterDetail(chapter.endpoint);
      
      if (response.success) {
        setChapterData(response.data);
      } else {
        setError('Gagal memuat chapter');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const goToNextPage = () => {
    if (chapterData && currentPage < chapterData.image.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageImage = (imageUrl, index) => (
    <View key={index} style={styles.pageContainer}>
      <CachedImage
        source={{ uri: getSafeImageUrl(imageUrl) }}
        style={styles.pageImage}
        resizeMode="contain"
        onError={() => console.log(`Failed to load image: ${imageUrl}`)}
      />
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Memuat chapter..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadChapterData}
      />
    );
  }

  if (!chapterData || !chapterData.image || chapterData.image.length === 0) {
    return (
      <ErrorMessage
        message="Chapter tidak memiliki gambar"
        onRetry={loadChapterData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.readerContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {chapterData.image.map((imageUrl, index) => 
            renderPageImage(imageUrl, index)
          )}
        </ScrollView>
      </TouchableOpacity>

      {/* Controls overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>← Kembali</Text>
            </TouchableOpacity>
            
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterTitle} numberOfLines={1}>
                {chapterName}
              </Text>
              <Text style={styles.comicTitle} numberOfLines={1}>
                {comic.title}
              </Text>
            </View>
          </View>

          {/* Bottom bar */}
          <View style={styles.bottomBar}>
            <Text style={styles.pageCounter}>
              {chapterData.image.length} halaman
            </Text>
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentPage === 1 && styles.navButtonDisabled
                ]}
                onPress={goToPrevPage}
                disabled={currentPage === 1}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.navButtonText,
                  currentPage === 1 && styles.navButtonTextDisabled
                ]}>
                  ← Prev
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentPage === chapterData.image.length && styles.navButtonDisabled
                ]}
                onPress={goToNextPage}
                disabled={currentPage === chapterData.image.length}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.navButtonText,
                  currentPage === chapterData.image.length && styles.navButtonTextDisabled
                ]}>
                  Next →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  readerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: screenWidth,
    minHeight: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: screenWidth,
    height: undefined,
    aspectRatio: 0.7, // Typical manga page ratio
    maxHeight: screenHeight,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, // Account for status bar
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  comicTitle: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20, // Account for home indicator
  },
  pageCounter: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
  },
  navButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#7F8C8D',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#BDC3C7',
  },
});

export default ChapterReaderScreen;

