import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { cacheImage, getCachedImagePath } from '../utils/cache';
import { getSafeImageUrl } from '../utils/helpers';

const CachedImage = ({ 
  source, 
  style, 
  resizeMode = 'cover',
  placeholder = null,
  onLoad,
  onError,
  enableCache = true,
  ...props 
}) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImage();
  }, [source]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const sourceUri = typeof source === 'string' ? source : source?.uri;
      if (!sourceUri) {
        setError(true);
        setLoading(false);
        return;
      }

      const safeUri = getSafeImageUrl(sourceUri);
      
      if (enableCache) {
        // Try to get cached image first
        const cachedPath = await getCachedImagePath(safeUri);
        
        if (cachedPath) {
          // Use cached image
          setImageUri(`file://${cachedPath}`);
          setLoading(false);
          return;
        }
        
        // Cache image in background and use original URL for now
        cacheImage(safeUri).catch(error => {
          console.warn('Failed to cache image:', error);
        });
      }
      
      // Use original URL
      setImageUri(safeUri);
      setLoading(false);
    } catch (err) {
      console.error('Error loading image:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
    if (onError) {
      onError();
    }
  };

  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }
    
    return (
      <View style={[styles.placeholder, style]}>
        {loading ? (
          <ActivityIndicator size="small" color="#BDC3C7" />
        ) : (
          <View style={styles.errorPlaceholder}>
            <Text style={styles.errorText}>📷</Text>
          </View>
        )}
      </View>
    );
  };

  if (error || !imageUri) {
    return renderPlaceholder();
  }

  return (
    <View style={style}>
      <Image
        source={{ uri: imageUri }}
        style={[style, loading && styles.hidden]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {loading && (
        <View style={[styles.loadingOverlay, style]}>
          <ActivityIndicator size="small" color="#BDC3C7" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    opacity: 0.5,
  },
  hidden: {
    opacity: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CachedImage;

