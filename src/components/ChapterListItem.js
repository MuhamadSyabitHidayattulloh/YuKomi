import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { formatDate } from '../utils/helpers';

const ChapterListItem = ({ 
  chapter, 
  onPress, 
  isLastRead = false,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLastRead && styles.lastReadContainer,
        style
      ]}
      onPress={() => onPress && onPress(chapter)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <Text style={[
          styles.chapterName,
          isLastRead && styles.lastReadText
        ]}>
          {chapter.name}
        </Text>
        
        {chapter.date && (
          <Text style={styles.chapterDate}>
            {formatDate(chapter.date)}
          </Text>
        )}
      </View>
      
      {isLastRead && (
        <View style={styles.lastReadBadge}>
          <Text style={styles.lastReadBadgeText}>Terakhir Dibaca</Text>
        </View>
      )}
      
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastReadContainer: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  contentContainer: {
    flex: 1,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  lastReadText: {
    color: '#27AE60',
    fontWeight: '600',
  },
  chapterDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  lastReadBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  lastReadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  arrow: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#BDC3C7',
    fontWeight: '300',
  },
});

export default ChapterListItem;

