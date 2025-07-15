import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { getFavorites } from './storage';
import { getComicInfo } from '../api/komikku';

// Background task name
const BACKGROUND_FETCH_TASK = 'background-fetch-yukomi';

// Notification configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return {
        success: false,
        message: 'Izin notifikasi diperlukan untuk mendapatkan update chapter baru',
      };
    }
    
    // Get push token for future use
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return {
      success: false,
      message: 'Gagal meminta izin notifikasi',
    };
  }
};

// Schedule local notification
export const scheduleLocalNotification = async (title, body, data = {}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Show immediately
    });
    
    return { success: true, notificationId };
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return { success: false, error: error.message };
  }
};

// Schedule notification with delay
export const scheduleDelayedNotification = async (title, body, delaySeconds, data = {}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: {
        seconds: delaySeconds,
      },
    });
    
    return { success: true, notificationId };
  } catch (error) {
    console.error('Error scheduling delayed notification:', error);
    return { success: false, error: error.message };
  }
};

// Cancel notification
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return { success: true };
  } catch (error) {
    console.error('Error canceling notification:', error);
    return { success: false, error: error.message };
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return { success: true };
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    return { success: false, error: error.message };
  }
};

// === BACKGROUND FETCH FOR NEW CHAPTERS ===

// Define background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Background fetch started');
    
    // Get user's favorite comics
    const favorites = await getFavorites();
    if (favorites.length === 0) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    let hasNewChapters = false;
    const newChapters = [];
    
    // Check for new chapters in favorite comics
    for (const comic of favorites.slice(0, 10)) { // Limit to 10 comics to avoid timeout
      try {
        const response = await getComicInfo(comic.endpoint);
        if (response.success && response.data.chapter_list) {
          const latestChapter = response.data.chapter_list[0];
          
          // Compare with stored latest chapter (you might want to store this)
          // For now, we'll just check if there are chapters
          if (latestChapter) {
            newChapters.push({
              comic: comic.title,
              chapter: latestChapter.name,
              endpoint: latestChapter.endpoint,
            });
            hasNewChapters = true;
          }
        }
      } catch (error) {
        console.error(`Error checking comic ${comic.title}:`, error);
      }
    }
    
    // Send notification if new chapters found
    if (hasNewChapters && newChapters.length > 0) {
      const title = 'Chapter Baru Tersedia!';
      const body = newChapters.length === 1 
        ? `${newChapters[0].chapter} dari ${newChapters[0].comic}`
        : `${newChapters.length} chapter baru dari komik favorit Anda`;
      
      await scheduleLocalNotification(title, body, {
        type: 'new_chapters',
        chapters: newChapters,
      });
    }
    
    console.log('Background fetch completed');
    return hasNewChapters 
      ? BackgroundFetch.BackgroundFetchResult.NewData 
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Background fetch error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register background fetch
export const registerBackgroundFetch = async () => {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    
    if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60, // 1 hour
        stopOnTerminate: false,
        startOnBoot: true,
      });
      
      return { success: true };
    } else {
      return {
        success: false,
        message: 'Background fetch tidak tersedia di perangkat ini',
      };
    }
  } catch (error) {
    console.error('Error registering background fetch:', error);
    return {
      success: false,
      message: 'Gagal mendaftarkan background fetch',
    };
  }
};

// Unregister background fetch
export const unregisterBackgroundFetch = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    return { success: true };
  } catch (error) {
    console.error('Error unregistering background fetch:', error);
    return { success: false, error: error.message };
  }
};

// === NOTIFICATION HANDLERS ===

// Handle notification received while app is running
export const addNotificationReceivedListener = (handler) => {
  return Notifications.addNotificationReceivedListener(handler);
};

// Handle notification response (when user taps notification)
export const addNotificationResponseReceivedListener = (handler) => {
  return Notifications.addNotificationResponseReceivedListener(handler);
};

// === UTILITY FUNCTIONS ===

// Send new chapter notification
export const sendNewChapterNotification = async (comicTitle, chapterName, comicEndpoint, chapterEndpoint) => {
  try {
    const title = 'Chapter Baru!';
    const body = `${chapterName} dari ${comicTitle} sudah tersedia`;
    
    return await scheduleLocalNotification(title, body, {
      type: 'new_chapter',
      comicTitle,
      chapterName,
      comicEndpoint,
      chapterEndpoint,
    });
  } catch (error) {
    console.error('Error sending new chapter notification:', error);
    return { success: false, error: error.message };
  }
};

// Send reading reminder notification
export const sendReadingReminderNotification = async (message = 'Jangan lupa baca komik favorit Anda!') => {
  try {
    const title = 'Pengingat Baca';
    
    return await scheduleLocalNotification(title, message, {
      type: 'reading_reminder',
    });
  } catch (error) {
    console.error('Error sending reading reminder:', error);
    return { success: false, error: error.message };
  }
};

// Schedule daily reading reminder
export const scheduleDailyReadingReminder = async (hour = 19, minute = 0) => {
  try {
    // Calculate seconds until next occurrence
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delaySeconds = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pengingat Baca',
        body: 'Waktunya baca komik favorit Anda!',
        data: {
          type: 'daily_reminder',
        },
        sound: 'default',
      },
      trigger: {
        seconds: delaySeconds,
        repeats: true,
      },
    });
    
    return { success: true, notificationId };
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return { success: false, error: error.message };
  }
};

// Get notification settings
export const getNotificationSettings = async () => {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    const backgroundFetchStatus = await BackgroundFetch.getStatusAsync();
    
    return {
      permissionsGranted: permissions.status === 'granted',
      backgroundFetchAvailable: backgroundFetchStatus === BackgroundFetch.BackgroundFetchStatus.Available,
      permissions,
      backgroundFetchStatus,
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      permissionsGranted: false,
      backgroundFetchAvailable: false,
      error: error.message,
    };
  }
};

export default {
  requestNotificationPermissions,
  scheduleLocalNotification,
  scheduleDelayedNotification,
  cancelNotification,
  cancelAllNotifications,
  registerBackgroundFetch,
  unregisterBackgroundFetch,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  sendNewChapterNotification,
  sendReadingReminderNotification,
  scheduleDailyReadingReminder,
  getNotificationSettings,
};

