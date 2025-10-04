
import { useState, useEffect, useCallback } from 'react';
import { ParliamentaryMember } from '@/types/ParliamentaryMember';
import { parliamentaryMembersService } from '@/services/parliamentaryMembersService';
import { dataUpdateScheduler } from '@/utils/dataUpdateScheduler';

export interface UseParliamentaryMembersResult {
  members: ParliamentaryMember[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  searchMembers: (query: string, state?: string) => ParliamentaryMember[];
  getMemberById: (id: string) => ParliamentaryMember | undefined;
}

export const useParliamentaryMembers = (): UseParliamentaryMembersResult => {
  const [members, setMembers] = useState<ParliamentaryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    console.log('Fetching parliamentary members...');
    setLoading(true);
    setError(null);
    
    try {
      // Check if we need to update data daily
      const { updated, success } = await dataUpdateScheduler.checkAndUpdate();
      
      if (updated && !success) {
        console.warn('Daily update failed, using cached data');
      }
      
      const fetchedMembers = await parliamentaryMembersService.fetchMembers();
      setMembers(fetchedMembers);
      console.log(`Loaded ${fetchedMembers.length} parliamentary members`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load parliamentary members';
      console.error('Error fetching members:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMembers = useCallback(async () => {
    console.log('Refreshing parliamentary members...');
    setRefreshing(true);
    setError(null);
    
    try {
      // Force an update
      const updateSuccess = await dataUpdateScheduler.forceUpdate();
      if (updateSuccess) {
        const fetchedMembers = await parliamentaryMembersService.fetchMembers();
        setMembers(fetchedMembers);
        console.log(`Refreshed ${fetchedMembers.length} parliamentary members`);
      } else {
        setError('Could not fetch latest data, showing cached results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      console.error('Error during refresh:', err);
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const searchMembers = useCallback((query: string, state?: string) => {
    return parliamentaryMembersService.searchMembers(query, state);
  }, []);

  const getMemberById = useCallback((id: string) => {
    return parliamentaryMembersService.getMemberById(id);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    refreshing,
    error,
    fetchMembers,
    refreshMembers,
    searchMembers,
    getMemberById,
  };
};
