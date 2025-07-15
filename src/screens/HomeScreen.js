import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import ComicCard from '../components/ComicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  getPopularComics,
  getRecommendedComics,
  getNewestComics,
} from '../api/komikku';

const HomeScreen = ({ navigation }) => {
  const [popularComics, setPopularComics] = useState([]);
  const [recommendedComics, setRecommendedComics] = useState([]);
  const [newestComics, setNewestComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      
      const [popularResponse, recommendedResponse, newestResponse] = await Promise.all([
        getPopularComics(1),
        getRecommendedComics(1),
        getNewestComics(1),
      ]);

      if (popularResponse.success) {
        setPopularComics(popularResponse.data.slice(0, 10));
      }
      
      if (recommendedResponse.success) {
        setRecommendedComics(recommendedResponse.data.slice(0, 10));
      }
      
      if (newestResponse.success) {
        setNewestComics(newestResponse.data.slice(0, 10));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const navigateToComicDetail = (comic) => {
    navigation.navigate('ComicDetail', { comic });
  };

  const navigateToSeeAll = (type, title) => {
    // Implementasi untuk melihat semua komik berdasarkan kategori
    // Bisa dibuat screen terpisah atau menggunakan SearchScreen dengan filter
    console.log(`Navigate to see all ${type}`);
  };

  const renderComicSection = (title, comics, type) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => navigateToSeeAll(type, title)}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={comics}
        renderItem={({ item }) => (
          <ComicCard
            comic={item}
            onPress={navigateToComicDetail}
            style={styles.comicCard}
          />
        )}
        keyExtractor={(item, index) => `${type}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Memuat komik..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat datang di YuKomi!</Text>
        <Text style={styles.subtitleText}>
          Temukan komik favorit Anda
        </Text>
      </View>

      {popularComics.length > 0 && 
        renderComicSection('Komik Populer', popularComics, 'popular')
      }

      {recommendedComics.length > 0 && 
        renderComicSection('Rekomendasi', recommendedComics, 'recommended')
      }

      {newestComics.length > 0 && 
        renderComicSection('Komik Terbaru', newestComics, 'newest')
      }
    </ScrollView>
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
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '500',
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  comicCard: {
    marginRight: 12,
    width: 140,
  },
});

export default HomeScreen;

