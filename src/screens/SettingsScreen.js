import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { 
  getThemeSettings, 
  updateThemeSettings, 
  getCurrentTheme,
  THEMES,
  COLOR_SCHEMES,
  applyColorScheme,
  resetTheme 
} from '../utils/theme';
import {
  getCacheSize,
  clearAllCache,
  getCacheSettings,
  updateCacheSettings,
} from '../utils/cache';
import {
  getNotificationSettings,
  requestNotificationPermissions,
  registerBackgroundFetch,
  unregisterBackgroundFetch,
  scheduleDailyReadingReminder,
  cancelAllNotifications,
} from '../utils/notifications';

const SettingsScreen = ({ navigation }) => {
  const [theme, setTheme] = useState(null);
  const [themeSettings, setThemeSettings] = useState(null);
  const [cacheSize, setCacheSize] = useState(null);
  const [cacheSettings, setCacheSettings] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [
        currentTheme,
        themeConfig,
        cacheSizeData,
        cacheConfig,
        notificationConfig,
      ] = await Promise.all([
        getCurrentTheme(),
        getThemeSettings(),
        getCacheSize(),
        getCacheSettings(),
        getNotificationSettings(),
      ]);

      setTheme(currentTheme);
      setThemeSettings(themeConfig);
      setCacheSize(cacheSizeData);
      setCacheSettings(cacheConfig);
      setNotificationSettings(notificationConfig);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    try {
      await updateThemeSettings({ theme: newTheme });
      await loadSettings();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah tema');
    }
  };

  const handleColorSchemeChange = async (schemeName) => {
    try {
      await applyColorScheme(schemeName);
      await loadSettings();
      setShowColorPicker(false);
      Alert.alert('Berhasil', 'Skema warna berhasil diterapkan');
    } catch (error) {
      Alert.alert('Error', 'Gagal menerapkan skema warna');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Hapus Cache',
      'Apakah Anda yakin ingin menghapus semua cache? Ini akan menghapus gambar dan chapter yang tersimpan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllCache();
              await loadSettings();
              Alert.alert('Berhasil', 'Cache berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus cache');
            }
          },
        },
      ]
    );
  };

  const handleNotificationToggle = async (enabled) => {
    try {
      if (enabled) {
        const result = await requestNotificationPermissions();
        if (result.success) {
          await registerBackgroundFetch();
          Alert.alert('Berhasil', 'Notifikasi berhasil diaktifkan');
        } else {
          Alert.alert('Error', result.message);
        }
      } else {
        await unregisterBackgroundFetch();
        await cancelAllNotifications();
        Alert.alert('Berhasil', 'Notifikasi berhasil dinonaktifkan');
      }
      await loadSettings();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah pengaturan notifikasi');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderSection = (title, children) => (
    <View style={[styles.section, { backgroundColor: theme?.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme?.text.primary }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderSettingItem = (title, subtitle, onPress, rightComponent) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme?.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme?.text.primary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme?.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  if (loading || !theme) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Memuat pengaturan...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Theme Settings */}
        {renderSection('Tampilan', (
          <>
            {renderSettingItem(
              'Tema',
              `Saat ini: ${themeSettings?.theme === THEMES.AUTO ? 'Otomatis' : 
                themeSettings?.theme === THEMES.DARK ? 'Gelap' : 'Terang'}`,
              null,
              <View style={styles.themeButtons}>
                {Object.values(THEMES).map((themeOption) => (
                  <TouchableOpacity
                    key={themeOption}
                    style={[
                      styles.themeButton,
                      themeSettings?.theme === themeOption && styles.activeThemeButton,
                      { borderColor: theme.border }
                    ]}
                    onPress={() => handleThemeChange(themeOption)}
                  >
                    <Text style={[
                      styles.themeButtonText,
                      { color: theme.text.primary },
                      themeSettings?.theme === themeOption && { color: theme.primary }
                    ]}>
                      {themeOption === THEMES.AUTO ? 'Auto' :
                       themeOption === THEMES.DARK ? 'Gelap' : 'Terang'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {renderSettingItem(
              'Skema Warna',
              'Pilih warna aksen aplikasi',
              () => setShowColorPicker(true),
              <Text style={[styles.arrow, { color: theme.text.secondary }]}>›</Text>
            )}
          </>
        ))}

        {/* Cache Settings */}
        {renderSection('Cache & Storage', (
          <>
            {renderSettingItem(
              'Ukuran Cache',
              cacheSize ? `Total: ${formatFileSize(cacheSize.totalSize)}` : 'Menghitung...',
              null,
              null
            )}
            
            {renderSettingItem(
              'Hapus Cache',
              'Hapus semua gambar dan chapter yang tersimpan',
              handleClearCache,
              <Text style={[styles.arrow, { color: theme.text.secondary }]}>›</Text>
            )}
          </>
        ))}

        {/* Notification Settings */}
        {renderSection('Notifikasi', (
          <>
            {renderSettingItem(
              'Notifikasi Chapter Baru',
              notificationSettings?.permissionsGranted 
                ? 'Aktif - Anda akan mendapat notifikasi chapter baru'
                : 'Nonaktif - Izin notifikasi diperlukan',
              null,
              <Switch
                value={notificationSettings?.permissionsGranted || false}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.surface}
              />
            )}
          </>
        ))}

        {/* About */}
        {renderSection('Tentang', (
          <>
            {renderSettingItem(
              'Versi Aplikasi',
              '1.0.0',
              null,
              null
            )}
            
            {renderSettingItem(
              'Reset Pengaturan',
              'Kembalikan semua pengaturan ke default',
              () => {
                Alert.alert(
                  'Reset Pengaturan',
                  'Apakah Anda yakin ingin mereset semua pengaturan?',
                  [
                    { text: 'Batal', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await resetTheme();
                          await loadSettings();
                          Alert.alert('Berhasil', 'Pengaturan berhasil direset');
                        } catch (error) {
                          Alert.alert('Error', 'Gagal mereset pengaturan');
                        }
                      },
                    },
                  ]
                );
              },
              <Text style={[styles.arrow, { color: theme.text.secondary }]}>›</Text>
            )}
          </>
        ))}
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
              Pilih Skema Warna
            </Text>
            
            <View style={styles.colorGrid}>
              {Object.entries(COLOR_SCHEMES).map(([name, scheme]) => (
                <TouchableOpacity
                  key={name}
                  style={[styles.colorOption, { backgroundColor: scheme.primary }]}
                  onPress={() => handleColorSchemeChange(name)}
                >
                  <Text style={styles.colorOptionText}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.border }]}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text.primary }]}>
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '300',
  },
  themeButtons: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeThemeButton: {
    borderWidth: 2,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  colorOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;

