import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ComicCard from '../components/ComicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFavorites } from '../utils/storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload favorites ketika screen difokuskan
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const navigateToComicDetail = (comic) => {
    navigation.navigate('ComicDetail', { comic });
  };

  const renderComicItem = ({ item, index }) => (
    <ComicCard
      comic={item}
      onPress={navigateToComicDetail}
      style={[
        styles.comicCard,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>Belum ada favorit</Text>
      <Text style={styles.emptySubtitle}>
        Tambahkan komik ke favorit untuk melihatnya di sini
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Memuat favorit..." />;
  }

  return (
    <View style={styles.container}>
      {favorites.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.countText}>
            {favorites.length} komik favorit
          </Text>
        </View>
      )}
      
      <FlatList
        data={favorites}
        renderItem={renderComicItem}
        keyExtractor={(item, index) => `favorite-${index}`}
        numColumns={2}
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
  comicCard: {
    marginBottom: 16,
  },
  leftCard: {
    marginRight: 8,
  },
  rightCard: {
    marginLeft: 8,
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

export default FavoritesScreen;

