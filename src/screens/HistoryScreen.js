import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ComicCard from '../components/ComicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getReadingHistory, removeFromHistory } from '../utils/storage';
import { formatDate } from '../utils/helpers';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload history ketika screen difokuskan
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const historyData = await getReadingHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const navigateToComicDetail = (comic) => {
    navigation.navigate('ComicDetail', { comic });
  };

  const handleRemoveFromHistory = async (endpoint) => {
    try {
      await removeFromHistory(endpoint);
      setHistory(prev => prev.filter(item => item.endpoint !== endpoint));
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity
        style={styles.comicContainer}
        onPress={() => navigateToComicDetail(item)}
        activeOpacity={0.7}
      >
        <ComicCard
          comic={item}
          onPress={navigateToComicDetail}
          style={styles.comicCard}
        />
      </TouchableOpacity>
      
      <View style={styles.historyInfo}>
        <Text style={styles.lastReadText}>
          Terakhir baca: {item.lastReadChapter?.name || 'Tidak diketahui'}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(item.lastReadAt)}
        </Text>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromHistory(item.endpoint)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeText}>Hapus dari riwayat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
      <Text style={styles.emptySubtitle}>
        Mulai baca komik untuk melihat riwayat di sini
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Memuat riwayat..." />;
  }

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.countText}>
            {history.length} komik dalam riwayat
          </Text>
        </View>
      )}
      
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => `history-${index}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  countText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comicContainer: {
    width: 80,
  },
  comicCard: {
    width: 80,
    marginBottom: 0,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  lastReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E74C3C',
    borderRadius: 6,
  },
  removeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HistoryScreen;

