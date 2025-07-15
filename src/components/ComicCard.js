import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CachedImage from './CachedImage';
import {
  formatTitle,
  formatDescription,
  getComicTypeColor,
  getSafeImageUrl,
} from '../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 kolom dengan margin

const ComicCard = ({ comic, onPress, style }) => {
  const typeColor = getComicTypeColor(comic.type);
  const safeImageUrl = getSafeImageUrl(comic.image);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(comic)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <CachedImage
          source={{ uri: safeImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <Text style={styles.typeText}>{comic.type}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {formatTitle(comic.title, 40)}
        </Text>
        
        {comic.desc && (
          <Text style={styles.description} numberOfLines={3}>
            {formatDescription(comic.desc, 80)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 16,
  },
});

export default ComicCard;

