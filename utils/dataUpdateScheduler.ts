
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parliamentaryMembersService } from '@/services/parliamentaryMembersService';

const LAST_UPDATE_KEY = 'parliamentary_members_last_update';
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class DataUpdateScheduler {
  private static instance: DataUpdateScheduler;

  static getInstance(): DataUpdateScheduler {
    if (!DataUpdateScheduler.instance) {
      DataUpdateScheduler.instance = new DataUpdateScheduler();
    }
    return DataUpdateScheduler.instance;
  }

  // Check if data needs to be updated (daily check)
  async shouldUpdateData(): Promise<boolean> {
    try {
      const lastUpdateStr = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      
      if (!lastUpdateStr) {
        console.log('No previous update found, should update');
        return true;
      }

      const lastUpdate = new Date(lastUpdateStr);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdate.getTime();

      const shouldUpdate = timeDiff >= UPDATE_INTERVAL_MS;
      console.log(`Last update: ${lastUpdate.toISOString()}, Should update: ${shouldUpdate}`);
      
      return shouldUpdate;
    } catch (error) {
      console.error('Error checking update status:', error);
      return true; // Default to updating if we can't check
    }
  }

  // Perform the daily data update
  async performDailyUpdate(): Promise<boolean> {
    try {
      console.log('Performing daily data update...');
      
      const updateSuccess = await parliamentaryMembersService.updateMembersData();
      
      if (updateSuccess) {
        // Record the successful update time
        await AsyncStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
        console.log('Daily update completed successfully');
        return true;
      } else {
        console.log('Daily update failed');
        return false;
      }
    } catch (error) {
      console.error('Error during daily update:', error);
      return false;
    }
  }

  // Check and perform update if needed
  async checkAndUpdate(): Promise<{ updated: boolean; success: boolean }> {
    const shouldUpdate = await this.shouldUpdateData();
    
    if (!shouldUpdate) {
      return { updated: false, success: true };
    }

    const success = await this.performDailyUpdate();
    return { updated: true, success };
  }

  // Force an update (useful for manual refresh)
  async forceUpdate(): Promise<boolean> {
    return await this.performDailyUpdate();
  }

  // Get last update time
  async getLastUpdateTime(): Promise<Date | null> {
    try {
      const lastUpdateStr = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      return lastUpdateStr ? new Date(lastUpdateStr) : null;
    } catch (error) {
      console.error('Error getting last update time:', error);
      return null;
    }
  }

  // Clear update history (useful for testing)
  async clearUpdateHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LAST_UPDATE_KEY);
      console.log('Update history cleared');
    } catch (error) {
      console.error('Error clearing update history:', error);
    }
  }
}

export const dataUpdateScheduler = DataUpdateScheduler.getInstance();
