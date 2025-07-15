import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import { cacheChapter, getCachedChapter } from '../utils/cache';
import { getChapterDetail } from '../api/komikku';

const DownloadButton = ({ 
  comic, 
  chapter, 
  style,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}) => {
  const [downloadState, setDownloadState] = useState('idle'); // idle, downloading, downloaded, error
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkDownloadStatus();
  }, [comic, chapter]);

  const checkDownloadStatus = async () => {
    try {
      const cachedChapter = await getCachedChapter(comic.endpoint, chapter.endpoint);
      if (cachedChapter.success) {
        setDownloadState('downloaded');
      } else {
        setDownloadState('idle');
      }
    } catch (error) {
      console.error('Error checking download status:', error);
      setDownloadState('idle');
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadState('downloading');
      setProgress(0);
      
      if (onDownloadStart) {
        onDownloadStart(comic, chapter);
      }

      // Get chapter data first
      const chapterResponse = await getChapterDetail(chapter.endpoint);
      if (!chapterResponse.success) {
        throw new Error('Gagal mengambil data chapter');
      }

      // Cache the chapter
      const cacheResult = await cacheChapter(comic, chapter, chapterResponse.data);
      
      if (cacheResult.success) {
        setDownloadState('downloaded');
        setProgress(100);
        
        if (onDownloadComplete) {
          onDownloadComplete(comic, chapter, cacheResult);
        }
        
        Alert.alert(
          'Download Selesai',
          `Chapter "${chapter.name}" berhasil didownload untuk dibaca offline.`
        );
      } else {
        throw new Error(cacheResult.error || 'Gagal mendownload chapter');
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadState('error');
      
      if (onDownloadError) {
        onDownloadError(comic, chapter, error);
      }
      
      Alert.alert(
        'Download Gagal',
        error.message || 'Terjadi kesalahan saat mendownload chapter'
      );
    }
  };

  const handleRetry = () => {
    setDownloadState('idle');
    handleDownload();
  };

  const getButtonContent = () => {
    switch (downloadState) {
      case 'downloading':
        return (
          <View style={styles.downloadingContent}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.downloadingText}>
              Downloading... {Math.round(progress)}%
            </Text>
          </View>
        );
      
      case 'downloaded':
        return (
          <View style={styles.downloadedContent}>
            <Text style={styles.downloadedIcon}>✓</Text>
            <Text style={styles.downloadedText}>Downloaded</Text>
          </View>
        );
      
      case 'error':
        return (
          <View style={styles.errorContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>Retry</Text>
          </View>
        );
      
      default:
        return (
          <View style={styles.idleContent}>
            <Text style={styles.downloadIcon}>⬇️</Text>
            <Text style={styles.downloadText}>Download</Text>
          </View>
        );
    }
  };

  const getButtonStyle = () => {
    switch (downloadState) {
      case 'downloading':
        return [styles.button, styles.downloadingButton];
      case 'downloaded':
        return [styles.button, styles.downloadedButton];
      case 'error':
        return [styles.button, styles.errorButton];
      default:
        return [styles.button, styles.idleButton];
    }
  };

  const isDisabled = downloadState === 'downloading';

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={downloadState === 'error' ? handleRetry : handleDownload}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
  },
  idleButton: {
    backgroundColor: '#3498DB',
  },
  downloadingButton: {
    backgroundColor: '#F39C12',
  },
  downloadedButton: {
    backgroundColor: '#2ECC71',
  },
  errorButton: {
    backgroundColor: '#E74C3C',
  },
  idleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  downloadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  downloadedIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6,
  },
  downloadedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DownloadButton;

