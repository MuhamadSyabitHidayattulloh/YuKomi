import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ComicDetailScreen from '../screens/ComicDetailScreen';
import ChapterReaderScreen from '../screens/ChapterReaderScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator untuk halaman utama
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498DB',
        tabBarInactiveTintColor: '#BDC3C7',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E9ECEF',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#3498DB',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🏠" color={color} size={size} />
          ),
          headerTitle: 'YuKomi',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Cari',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="🔍" color={color} size={size} />
          ),
          headerTitle: 'Cari Komik',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorit',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="❤️" color={color} size={size} />
          ),
          headerTitle: 'Komik Favorit',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="📚" color={color} size={size} />
          ),
          headerTitle: 'Riwayat Baca',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="⚙️" color={color} size={size} />
          ),
          headerTitle: 'Pengaturan',
        }}
      />
    </Tab.Navigator>
  );
};

// Komponen untuk ikon tab
const TabIcon = ({ icon, color, size }) => {
  return (
    <Text style={{ fontSize: size * 0.8, color }}>
      {icon}
    </Text>
  );
};

// Stack Navigator utama
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498DB',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ComicDetail"
          component={ComicDetailScreen}
          options={({ route }) => ({
            title: route.params?.title || 'Detail Komik',
          })}
        />
        <Stack.Screen
          name="ChapterReader"
          component={ChapterReaderScreen}
          options={({ route }) => ({
            title: route.params?.chapterName || 'Baca Komik',
            headerStyle: {
              backgroundColor: '#2C3E50',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

