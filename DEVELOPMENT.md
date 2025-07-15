# Development Guide - YuKomi App

## Project Overview

YuKomi adalah aplikasi mobile untuk membaca komik berbahasa Indonesia yang dibangun dengan React Native dan Expo. Aplikasi ini mengintegrasikan dengan [komikku-api](https://github.com/Romi666/komikku-api.git) untuk mengambil data komik.

## Technology Stack

### Core Technologies
- **React Native**: Framework untuk pengembangan mobile cross-platform
- **Expo**: Platform dan tools untuk React Native development
- **JavaScript**: Bahasa pemrograman utama
- **React Navigation**: Library untuk navigasi antar screen

### Dependencies
- **axios**: HTTP client untuk API calls
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-vector-icons**: Icon library
- **react-native-gesture-handler**: Gesture handling
- **react-native-reanimated**: Animation library
- **react-native-screens**: Native screen optimization
- **react-native-safe-area-context**: Safe area handling

## Project Structure

```
YuKomi/
├── src/
│   ├── api/                    # API service layer
│   │   └── komikku.js         # Komikku API integration
│   ├── components/            # Reusable UI components
│   │   ├── ComicCard.js       # Comic display card
│   │   ├── ChapterListItem.js # Chapter list item
│   │   ├── LoadingSpinner.js  # Loading indicator
│   │   ├── ErrorMessage.js    # Error display component
│   │   └── SearchBar.js       # Search input component
│   ├── navigation/            # Navigation configuration
│   │   └── AppNavigator.js    # Main navigation setup
│   ├── screens/               # Application screens
│   │   ├── HomeScreen.js      # Home/dashboard screen
│   │   ├── SearchScreen.js    # Search functionality
│   │   ├── FavoritesScreen.js # User favorites
│   │   ├── HistoryScreen.js   # Reading history
│   │   ├── ComicDetailScreen.js # Comic details
│   │   └── ChapterReaderScreen.js # Chapter reader
│   ├── utils/                 # Utility functions
│   │   ├── storage.js         # Local storage operations
│   │   └── helpers.js         # Helper functions
│   └── assets/                # Static assets
├── App.js                     # Main app component
├── index.js                   # App entry point
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## API Integration

### Base URL
```javascript
const BASE_URL = 'https://komiku-api.fly.dev/api';
```

### Available Endpoints

1. **Comic List**
   - `GET /comic/list` - Get all comics
   - `GET /comic/list?filter={type}` - Filter by type (manga/manhwa/manhua)

2. **Comic Categories**
   - `GET /comic/popular/page/{page}` - Popular comics
   - `GET /comic/recommended/page/{page}` - Recommended comics
   - `GET /comic/newest/page/{page}` - Newest comics

3. **Comic Details**
   - `GET /comic/info/{endpoint}` - Comic information
   - `GET /comic/search/{query}` - Search comics

4. **Chapter Content**
   - `GET /comic/chapter/{endpoint}` - Chapter images

### API Service Implementation

```javascript
// Example API call
import { getPopularComics } from '../api/komikku';

const loadPopularComics = async () => {
  try {
    const response = await getPopularComics(1);
    if (response.success) {
      setComics(response.data);
    }
  } catch (error) {
    console.error('Error loading comics:', error);
  }
};
```

## Local Storage

### Storage Keys
- `@YuKomi:favorites` - User favorite comics
- `@YuKomi:reading_history` - Reading history
- `@YuKomi:settings` - App settings

### Storage Operations

```javascript
import { addToFavorites, getFavorites } from '../utils/storage';

// Add to favorites
await addToFavorites(comic);

// Get favorites
const favorites = await getFavorites();
```

## Component Architecture

### Component Hierarchy
```
App
├── AppNavigator
│   ├── TabNavigator
│   │   ├── HomeScreen
│   │   ├── SearchScreen
│   │   ├── FavoritesScreen
│   │   └── HistoryScreen
│   ├── ComicDetailScreen
│   └── ChapterReaderScreen
```

### Reusable Components

#### ComicCard
```javascript
<ComicCard
  comic={comicData}
  onPress={navigateToDetail}
  style={customStyle}
/>
```

#### ChapterListItem
```javascript
<ChapterListItem
  chapter={chapterData}
  onPress={navigateToReader}
  isLastRead={true}
/>
```

## State Management

### Local State
Menggunakan React hooks untuk state management:
- `useState` untuk component state
- `useEffect` untuk side effects
- `useCallback` untuk memoized callbacks
- `useFocusEffect` untuk screen focus events

### Global State (Future)
Untuk pengembangan selanjutnya, pertimbangkan:
- Redux Toolkit untuk complex state
- Context API untuk theme/settings
- React Query untuk server state

## Navigation

### Navigation Structure
```javascript
// Stack Navigator
MainStack
├── MainTabs (Tab Navigator)
│   ├── Home
│   ├── Search
│   ├── Favorites
│   └── History
├── ComicDetail
└── ChapterReader
```

### Navigation Patterns
```javascript
// Navigate to screen with params
navigation.navigate('ComicDetail', { comic });

// Go back
navigation.goBack();

// Replace current screen
navigation.replace('Home');
```

## Styling Guidelines

### Design System
- **Primary Color**: #3498DB (Blue)
- **Secondary Color**: #E74C3C (Red)
- **Background**: #F8F9FA (Light Gray)
- **Text Primary**: #2C3E50 (Dark Gray)
- **Text Secondary**: #7F8C8D (Medium Gray)

### StyleSheet Patterns
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Use consistent spacing
  padding: 16,
  margin: 8,
  // Use semantic naming
  primaryButton: {
    backgroundColor: '#3498DB',
  },
});
```

## Performance Optimization

### Image Loading
- Use placeholder images for failed loads
- Implement lazy loading for large lists
- Cache images for offline viewing (future feature)

### List Performance
- Use `FlatList` for large datasets
- Implement `getItemLayout` when possible
- Use `keyExtractor` for unique keys

### Memory Management
- Remove event listeners in cleanup
- Avoid memory leaks in async operations
- Use `useMemo` and `useCallback` appropriately

## Error Handling

### API Errors
```javascript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  // Log error
  console.error('API Error:', error);
  // Show user-friendly message
  setError('Gagal memuat data');
}
```

### Component Error Boundaries
```javascript
// Future implementation
class ErrorBoundary extends React.Component {
  // Error boundary implementation
}
```

## Development Workflow

### Setup Development Environment
1. Install Node.js (v14+)
2. Install Expo CLI: `npm install -g expo-cli`
3. Clone repository
4. Run `npm install`
5. Start development: `npm start`

### Code Quality
- Use ESLint for code linting
- Use Prettier for code formatting
- Follow React Native best practices
- Write meaningful commit messages

### Testing Strategy
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API calls
- E2E tests for user flows

## Deployment

### Development Build
```bash
expo start
```

### Production Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### App Store Deployment
1. Build production version
2. Test on physical devices
3. Submit to app stores
4. Monitor crash reports

## Future Enhancements

### Planned Features
1. **Offline Reading**
   - Download chapters for offline access
   - Cache management
   - Sync when online

2. **Push Notifications**
   - New chapter alerts
   - Favorite comic updates
   - Reading reminders

3. **Advanced Settings**
   - Dark/Light theme toggle
   - Reading preferences
   - Download settings

4. **Social Features**
   - Reading lists sharing
   - Comments and reviews
   - User profiles

### Technical Improvements
1. **Performance**
   - Image caching
   - Background sync
   - Lazy loading

2. **User Experience**
   - Gesture navigation
   - Reading progress tracking
   - Bookmarks

3. **Code Quality**
   - TypeScript migration
   - Comprehensive testing
   - CI/CD pipeline

## Contributing

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns
- Keep components small and focused

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

### Issue Reporting
- Use provided issue templates
- Include reproduction steps
- Add screenshots/videos
- Specify device/OS information

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Tools
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)


## New Features Documentation v2.0.0

### Cache System Architecture

#### Cache Directory Structure
```
cache/
├── images/                 # Cached comic images
│   ├── image_hash_1.jpg
│   ├── image_hash_2.jpg
│   └── ...
└── chapters/              # Downloaded chapters
    ├── comic_chapter_1/
    │   ├── metadata.json
    │   ├── page_1.jpg
    │   ├── page_2.jpg
    │   └── ...
    └── comic_chapter_2/
        └── ...
```

#### Cache Management API
```javascript
// Initialize cache system
import { initializeCache } from './src/utils/cache';
await initializeCache();

// Cache an image
import { cacheImage } from './src/utils/cache';
const cachedPath = await cacheImage(imageUrl);

// Download a chapter
import { cacheChapter } from './src/utils/cache';
const result = await cacheChapter(comic, chapter, chapterData);

// Get cache size
import { getCacheSize } from './src/utils/cache';
const size = await getCacheSize();

// Clear cache
import { clearAllCache } from './src/utils/cache';
await clearAllCache();
```

#### CachedImage Component Usage
```javascript
import CachedImage from './src/components/CachedImage';

<CachedImage
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  enableCache={true}
  placeholder={<CustomPlaceholder />}
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Image failed')}
/>
```

### Notification System Architecture

#### Background Task Configuration
```javascript
// Register background fetch
import { registerBackgroundFetch } from './src/utils/notifications';
await registerBackgroundFetch();

// Background task definition
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  // Check for new chapters
  // Send notifications
  return BackgroundFetch.BackgroundFetchResult.NewData;
});
```

#### Notification API Usage
```javascript
// Request permissions
import { requestNotificationPermissions } from './src/utils/notifications';
const result = await requestNotificationPermissions();

// Schedule notification
import { scheduleLocalNotification } from './src/utils/notifications';
await scheduleLocalNotification('Title', 'Body', { data: 'custom' });

// Handle notification response
import { addNotificationResponseReceivedListener } from './src/utils/notifications';
const subscription = addNotificationResponseReceivedListener(response => {
  // Handle notification tap
});
```

#### Notification Types
```javascript
// New chapter notification
await sendNewChapterNotification(
  comicTitle, 
  chapterName, 
  comicEndpoint, 
  chapterEndpoint
);

// Reading reminder
await sendReadingReminderNotification('Time to read!');

// Daily reminder
await scheduleDailyReadingReminder(19, 0); // 7 PM
```

### Theme System Architecture

#### Theme Configuration
```javascript
// Theme definitions
export const LIGHT_THEME = {
  primary: '#3498DB',
  background: '#F8F9FA',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
  },
  // ... more colors
};

export const DARK_THEME = {
  primary: '#3498DB',
  background: '#1A1A1A',
  text: {
    primary: '#FFFFFF',
    secondary: '#BDC3C7',
  },
  // ... more colors
};
```

#### Theme Usage in Components
```javascript
import { getCurrentTheme } from './src/utils/theme';

const MyComponent = () => {
  const [theme, setTheme] = useState(null);
  
  useEffect(() => {
    const loadTheme = async () => {
      const currentTheme = await getCurrentTheme();
      setTheme(currentTheme);
    };
    loadTheme();
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: theme?.background }]}>
      <Text style={{ color: theme?.text.primary }}>Hello</Text>
    </View>
  );
};
```

#### Theme Switching
```javascript
import { updateThemeSettings, THEMES } from './src/utils/theme';

// Switch to dark theme
await updateThemeSettings({ theme: THEMES.DARK });

// Apply color scheme
import { applyColorScheme } from './src/utils/theme';
await applyColorScheme('purple');

// Reset theme
import { resetTheme } from './src/utils/theme';
await resetTheme();
```

### Settings Screen Implementation

#### Settings Structure
```javascript
const SettingsScreen = () => {
  return (
    <ScrollView>
      {/* Theme Settings */}
      {renderSection('Tampilan', (
        <>
          {/* Theme selector */}
          {/* Color scheme picker */}
        </>
      ))}
      
      {/* Cache Settings */}
      {renderSection('Cache & Storage', (
        <>
          {/* Cache size display */}
          {/* Clear cache button */}
        </>
      ))}
      
      {/* Notification Settings */}
      {renderSection('Notifikasi', (
        <>
          {/* Notification toggle */}
          {/* Background fetch settings */}
        </>
      ))}
    </ScrollView>
  );
};
```

#### Settings Data Flow
```
User Action → Settings Screen → Utility Function → Storage → App State Update
```

### Download System Implementation

#### DownloadButton Component
```javascript
import DownloadButton from './src/components/DownloadButton';

<DownloadButton
  comic={comic}
  chapter={chapter}
  onDownloadStart={(comic, chapter) => {
    console.log('Download started');
  }}
  onDownloadComplete={(comic, chapter, result) => {
    console.log('Download completed');
  }}
  onDownloadError={(comic, chapter, error) => {
    console.log('Download failed');
  }}
/>
```

#### Download States
```javascript
// Download states
const DOWNLOAD_STATES = {
  IDLE: 'idle',           // Ready to download
  DOWNLOADING: 'downloading', // Currently downloading
  DOWNLOADED: 'downloaded',   // Successfully downloaded
  ERROR: 'error'          // Download failed
};
```

### File System Integration

#### Expo FileSystem Usage
```javascript
import * as FileSystem from 'expo-file-system';

// Create directory
await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });

// Download file
const result = await FileSystem.downloadAsync(url, localPath);

// Read file
const content = await FileSystem.readAsStringAsync(filePath);

// Write file
await FileSystem.writeAsStringAsync(filePath, content);

// Get file info
const info = await FileSystem.getInfoAsync(filePath);

// Delete file/directory
await FileSystem.deleteAsync(path);
```

#### Storage Permissions
```javascript
// Android permissions in app.json
"android": {
  "permissions": [
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_EXTERNAL_STORAGE"
  ]
}
```

### Performance Optimizations

#### Image Loading Optimization
```javascript
// Lazy loading with cache
const CachedImage = ({ source, ...props }) => {
  const [imageUri, setImageUri] = useState(null);
  
  useEffect(() => {
    const loadImage = async () => {
      // Check cache first
      const cachedPath = await getCachedImagePath(source.uri);
      if (cachedPath) {
        setImageUri(`file://${cachedPath}`);
      } else {
        // Use original URL and cache in background
        setImageUri(source.uri);
        cacheImage(source.uri);
      }
    };
    loadImage();
  }, [source.uri]);
  
  return <Image source={{ uri: imageUri }} {...props} />;
};
```

#### Memory Management
```javascript
// Cleanup on component unmount
useEffect(() => {
  return () => {
    // Cancel ongoing downloads
    // Clear image references
    // Remove event listeners
  };
}, []);
```

### Error Handling Improvements

#### Cache Error Handling
```javascript
try {
  await cacheChapter(comic, chapter, data);
} catch (error) {
  if (error.code === 'STORAGE_FULL') {
    // Handle storage full
    await cleanupExpiredCache();
    // Retry or show user message
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network error
    // Show retry option
  }
}
```

#### Notification Error Handling
```javascript
const result = await requestNotificationPermissions();
if (!result.success) {
  // Show explanation to user
  // Provide alternative options
  // Graceful degradation
}
```

### Testing Strategy for New Features

#### Unit Tests
```javascript
// Cache utility tests
describe('Cache Utils', () => {
  beforeEach(async () => {
    await initializeCache();
  });
  
  afterEach(async () => {
    await clearAllCache();
  });
  
  test('should cache image successfully', async () => {
    const result = await cacheImage('https://example.com/image.jpg');
    expect(result).toBeTruthy();
  });
});
```

#### Integration Tests
```javascript
// Settings integration tests
describe('Settings Integration', () => {
  test('theme change should update all components', async () => {
    await updateThemeSettings({ theme: THEMES.DARK });
    const theme = await getCurrentTheme();
    expect(theme.isDark).toBe(true);
  });
});
```

### Deployment Considerations

#### Build Configuration
```javascript
// app.json updates for v2.0.0
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#3498DB"
        }
      ]
    ]
  }
}
```

#### Environment Variables
```javascript
// No additional environment variables needed
// All configuration handled through app.json and code
```

### Migration Guide from v1.0.0

#### Automatic Migration
```javascript
// App.js initialization
useEffect(() => {
  const initializeApp = async () => {
    // Initialize new features
    await initializeCache();
    await requestNotificationPermissions();
    
    // Migrate existing data (automatic)
    // No manual migration needed
  };
  initializeApp();
}, []);
```

#### Breaking Changes
```
None - v2.0.0 is fully backward compatible with v1.0.0
```

### Future Enhancements

#### Planned Features for v2.1.0
- **Cloud Sync**: Sync settings and favorites across devices
- **Advanced Reader**: Gesture controls and bookmarks
- **Social Features**: Comments and sharing
- **Reading Statistics**: Detailed analytics

#### Technical Debt
- **TypeScript Migration**: Gradual migration to TypeScript
- **Testing Coverage**: Increase test coverage to 80%+
- **Performance Monitoring**: Add real-time performance tracking
- **Code Splitting**: Optimize bundle size

### Troubleshooting Common Issues

#### Cache Issues
```javascript
// Clear corrupted cache
await clearAllCache();
await initializeCache();

// Check storage permissions
const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
```

#### Notification Issues
```javascript
// Check notification settings
const settings = await getNotificationSettings();
console.log('Permissions:', settings.permissionsGranted);
console.log('Background fetch:', settings.backgroundFetchAvailable);

// Re-register background task
await unregisterBackgroundFetch();
await registerBackgroundFetch();
```

#### Theme Issues
```javascript
// Reset theme to default
await resetTheme();

// Force theme reload
const theme = await getCurrentTheme();
// Update component state
```

This documentation provides comprehensive coverage of all new features in YuKomi v2.0.0, including implementation details, usage examples, and best practices for development and maintenance.

