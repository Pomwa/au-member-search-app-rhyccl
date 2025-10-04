
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parliamentaryMembersService } from '@/services/parliamentaryMembersService';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const LAST_UPDATE_KEY = 'last_parliament_update';
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BACKGROUND_FETCH_TASK = 'parliament-data-update';

// Register background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('Background fetch task started');
  
  try {
    const success = await dataUpdateScheduler.performUpdate();
    console.log('Background update result:', success);
    
    return success ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.Failed;
  } catch (error) {
    console.error('Background fetch error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export interface UpdateResult {
  updated: boolean;
  success: boolean;
  lastUpdate?: string;
  nextUpdate?: string;
  error?: string;
}

class DataUpdateScheduler {
  private static instance: DataUpdateScheduler;
  private isUpdating = false;

  static getInstance(): DataUpdateScheduler {
    if (!DataUpdateScheduler.instance) {
      DataUpdateScheduler.instance = new DataUpdateScheduler();
    }
    return DataUpdateScheduler.instance;
  }

  // Initialize background fetch
  async initializeBackgroundFetch(): Promise<void> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      
      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: UPDATE_INTERVAL,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log('Background fetch registered successfully');
      }
      
      const status = await BackgroundFetch.getStatusAsync();
      console.log('Background fetch status:', status);
      
    } catch (error) {
      console.error('Failed to initialize background fetch:', error);
    }
  }

  // Get last update timestamp
  private async getLastUpdateTime(): Promise<Date | null> {
    try {
      const lastUpdateStr = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      return lastUpdateStr ? new Date(lastUpdateStr) : null;
    } catch (error) {
      console.error('Error getting last update time:', error);
      return null;
    }
  }

  // Set last update timestamp
  private async setLastUpdateTime(date: Date): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_UPDATE_KEY, date.toISOString());
    } catch (error) {
      console.error('Error setting last update time:', error);
    }
  }

  // Check if update is needed
  async isUpdateNeeded(): Promise<boolean> {
    const lastUpdate = await this.getLastUpdateTime();
    
    if (!lastUpdate) {
      console.log('No previous update found, update needed');
      return true;
    }
    
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdate.getTime();
    const updateNeeded = timeDiff >= UPDATE_INTERVAL;
    
    console.log(`Last update: ${lastUpdate.toISOString()}, Time diff: ${Math.round(timeDiff / (1000 * 60 * 60))} hours, Update needed: ${updateNeeded}`);
    
    return updateNeeded;
  }

  // Perform the actual update
  async performUpdate(): Promise<boolean> {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping');
      return false;
    }

    this.isUpdating = true;
    
    try {
      console.log('Starting parliamentary data update...');
      
      const success = await parliamentaryMembersService.updateMembersData();
      
      if (success) {
        await this.setLastUpdateTime(new Date());
        console.log('Parliamentary data update completed successfully');
      } else {
        console.log('Parliamentary data update failed');
      }
      
      return success;
      
    } catch (error) {
      console.error('Error during parliamentary data update:', error);
      return false;
    } finally {
      this.isUpdating = false;
    }
  }

  // Check and update if needed (called on app start)
  async checkAndUpdate(): Promise<UpdateResult> {
    try {
      const lastUpdate = await this.getLastUpdateTime();
      const updateNeeded = await this.isUpdateNeeded();
      
      if (!updateNeeded) {
        const nextUpdate = lastUpdate ? new Date(lastUpdate.getTime() + UPDATE_INTERVAL) : new Date();
        
        return {
          updated: false,
          success: true,
          lastUpdate: lastUpdate?.toISOString(),
          nextUpdate: nextUpdate.toISOString()
        };
      }
      
      console.log('Update needed, performing update...');
      const success = await this.performUpdate();
      const now = new Date();
      const nextUpdate = new Date(now.getTime() + UPDATE_INTERVAL);
      
      return {
        updated: true,
        success,
        lastUpdate: now.toISOString(),
        nextUpdate: nextUpdate.toISOString(),
        error: success ? undefined : 'Failed to update parliamentary data'
      };
      
    } catch (error) {
      console.error('Error in checkAndUpdate:', error);
      return {
        updated: false,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Force update (called by pull-to-refresh)
  async forceUpdate(): Promise<boolean> {
    console.log('Force update requested');
    return await this.performUpdate();
  }

  // Get update status
  async getUpdateStatus(): Promise<{
    lastUpdate: string | null;
    nextUpdate: string | null;
    updateNeeded: boolean;
    isUpdating: boolean;
  }> {
    const lastUpdate = await this.getLastUpdateTime();
    const updateNeeded = await this.isUpdateNeeded();
    const nextUpdate = lastUpdate ? new Date(lastUpdate.getTime() + UPDATE_INTERVAL) : new Date();
    
    return {
      lastUpdate: lastUpdate?.toISOString() || null,
      nextUpdate: nextUpdate.toISOString(),
      updateNeeded,
      isUpdating: this.isUpdating
    };
  }

  // Clear update history (for testing)
  async clearUpdateHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LAST_UPDATE_KEY);
      console.log('Update history cleared');
    } catch (error) {
      console.error('Error clearing update history:', error);
    }
  }

  // Get time until next update
  async getTimeUntilNextUpdate(): Promise<number> {
    const lastUpdate = await this.getLastUpdateTime();
    
    if (!lastUpdate) return 0;
    
    const now = new Date();
    const nextUpdate = new Date(lastUpdate.getTime() + UPDATE_INTERVAL);
    const timeUntilNext = nextUpdate.getTime() - now.getTime();
    
    return Math.max(0, timeUntilNext);
  }

  // Format time until next update
  async getFormattedTimeUntilNextUpdate(): Promise<string> {
    const timeMs = await this.getTimeUntilNextUpdate();
    
    if (timeMs === 0) return 'Update available now';
    
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m until next update`;
    } else {
      return `${minutes}m until next update`;
    }
  }
}

export const dataUpdateScheduler = DataUpdateScheduler.getInstance();

// Initialize background fetch when module loads
dataUpdateScheduler.initializeBackgroundFetch().catch(error => {
  console.error('Failed to initialize background fetch:', error);
});
