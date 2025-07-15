import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import ComicCard from '../components/ComicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { searchComics, getComicList } from '../api/komikku';

const SearchScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [allComics, setAllComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      const response = await getComicList();
      
      if (response.success) {
        setAllComics(response.data);
        setSearchResults(response.data.slice(0, 20)); // Tampilkan 20 komik pertama
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Jika query kosong, tampilkan komik dari daftar umum
      setSearchResults(allComics.slice(0, 20));
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await searchComics(query);
      
      if (response.success) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults(allComics.slice(0, 20));
    setError(null);
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

  const renderEmptyState = () => {
    if (loading || initialLoading) return null;
    
    if (searchQuery && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Tidak ada hasil</Text>
          <Text style={styles.emptySubtitle}>
            Coba gunakan kata kunci yang berbeda
          </Text>
        </View>
      );
    }
    
    return null;
  };

  if (initialLoading) {
    return <LoadingSpinner text="Memuat daftar komik..." />;
  }

  if (error && searchResults.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
        />
        <ErrorMessage
          message={error}
          onRetry={loadInitialData}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="small" text="Mencari..." />
        </View>
      )}
      
      <FlatList
        data={searchResults}
        renderItem={renderComicItem}
        keyExtractor={(item, index) => `search-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
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
  loadingContainer: {
    padding: 20,
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
  },
});

export default SearchScreen;

