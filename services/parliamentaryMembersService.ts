
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParliamentaryMember, DataUpdateInfo } from '../types/ParliamentaryMember';
import { parliamentDataFetcher } from './parliamentDataFetcher';

const MEMBERS_CACHE_KEY = 'parliamentary_members_cache';
const UPDATE_INFO_KEY = 'parliamentary_update_info';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class ParliamentaryMembersService {
  private static instance: ParliamentaryMembersService;
  private members: ParliamentaryMember[] = [];
  private cacheLoaded = false;
  private updateInfo: DataUpdateInfo = {
    lastUpdated: '',
    nextUpdate: '',
    updateInProgress: false,
    lastUpdateSuccess: false
  };

  static getInstance(): ParliamentaryMembersService {
    if (!ParliamentaryMembersService.instance) {
      ParliamentaryMembersService.instance = new ParliamentaryMembersService();
    }
    return ParliamentaryMembersService.instance;
  }

  // Load cached data from AsyncStorage
  private async loadCachedData(): Promise<void> {
    if (this.cacheLoaded) return;

    try {
      const [cachedData, updateInfoData] = await Promise.all([
        AsyncStorage.getItem(MEMBERS_CACHE_KEY),
        AsyncStorage.getItem(UPDATE_INFO_KEY)
      ]);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          this.members = parsedData;
          console.log(`Loaded ${parsedData.length} members from cache`);
        }
      }

      if (updateInfoData) {
        this.updateInfo = JSON.parse(updateInfoData);
        console.log('Loaded update info from cache:', this.updateInfo);
      }

    } catch (error) {
      console.error('Error loading cached data:', error);
    } finally {
      this.cacheLoaded = true;
    }
  }

  // Save data to cache
  private async saveCachedData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(MEMBERS_CACHE_KEY, JSON.stringify(this.members)),
        AsyncStorage.setItem(UPDATE_INFO_KEY, JSON.stringify(this.updateInfo))
      ]);
      console.log('Members data and update info cached successfully');
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  // Check if cache is expired
  private isCacheExpired(): boolean {
    if (!this.updateInfo.lastUpdated) return true;
    
    const lastUpdate = new Date(this.updateInfo.lastUpdated);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdate.getTime();
    
    return timeDiff > CACHE_DURATION;
  }

  // Update next update time
  private updateNextUpdateTime(): void {
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + CACHE_DURATION);
    this.updateInfo.nextUpdate = nextUpdate.toISOString();
  }

  // Fetch members with automatic update checking
  async fetchMembers(forceUpdate: boolean = false): Promise<ParliamentaryMember[]> {
    console.log('Fetching parliamentary members from service...');
    
    // Load cached data first
    await this.loadCachedData();
    
    // Check if we need to update
    const needsUpdate = forceUpdate || this.isCacheExpired() || this.members.length === 0;
    
    if (needsUpdate && !this.updateInfo.updateInProgress) {
      console.log('Cache expired or force update requested, fetching fresh data...');
      
      try {
        this.updateInfo.updateInProgress = true;
        await this.saveCachedData();

        // Check if data source is available
        const isAvailable = await parliamentDataFetcher.checkDataSourceAvailability();
        
        if (isAvailable) {
          // Fetch fresh data from parliament websites
          const freshData = await parliamentDataFetcher.fetchAllParliamentaryData();
          
          if (freshData && freshData.length > 0) {
            this.members = freshData;
            this.updateInfo.lastUpdated = new Date().toISOString();
            this.updateInfo.lastUpdateSuccess = true;
            this.updateInfo.errorMessage = undefined;
            this.updateNextUpdateTime();
            
            console.log(`Successfully updated with ${freshData.length} members from live data`);
          } else {
            throw new Error('No data received from parliament websites');
          }
        } else {
          throw new Error('Parliament data sources are not available');
        }
        
      } catch (error) {
        console.error('Failed to fetch fresh data:', error);
        this.updateInfo.lastUpdateSuccess = false;
        this.updateInfo.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // If we have no cached data, use fallback data
        if (this.members.length === 0) {
          console.log('No cached data available, using fallback data');
          this.members = this.getFallbackData();
        }
      } finally {
        this.updateInfo.updateInProgress = false;
        await this.saveCachedData();
      }
    } else if (this.members.length === 0) {
      // No cached data and no update needed, use fallback
      console.log('Using fallback data');
      this.members = this.getFallbackData();
    }
    
    return [...this.members];
  }

  // Get fallback data when live data is not available
  private getFallbackData(): ParliamentaryMember[] {
    return [
      {
        id: 'fallback_1',
        fullName: 'Anthony Albanese',
        party: 'Australian Labor Party',
        suburb: 'Marrickville',
        state: 'NSW',
        electorate: 'Grayndler',
        chamber: 'House of Representatives',
        email: 'anthony.albanese.mp@aph.gov.au',
        phone: '(02) 9564 3588',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Prime Minister'],
        isMinister: true,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_2',
        fullName: 'Peter Dutton',
        party: 'Liberal Party of Australia',
        suburb: 'Dickson',
        state: 'QLD',
        electorate: 'Dickson',
        chamber: 'House of Representatives',
        email: 'peter.dutton.mp@aph.gov.au',
        phone: '(07) 3205 9977',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Leader of the Opposition'],
        isMinister: false,
        isShadowMinister: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_3',
        fullName: 'Penny Wong',
        party: 'Australian Labor Party',
        suburb: 'Adelaide',
        state: 'SA',
        chamber: 'Senate',
        email: 'senator.wong@aph.gov.au',
        phone: '(08) 8354 0511',
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Foreign Affairs', 'Leader of the Government in the Senate'],
        isMinister: true,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_4',
        fullName: 'Adam Bandt',
        party: 'Australian Greens',
        suburb: 'Melbourne',
        state: 'VIC',
        electorate: 'Melbourne',
        chamber: 'House of Representatives',
        email: 'adam.bandt.mp@aph.gov.au',
        phone: '(03) 9417 0772',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Leader of the Australian Greens'],
        isMinister: false,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_5',
        fullName: 'Tanya Plibersek',
        party: 'Australian Labor Party',
        suburb: 'Sydney',
        state: 'NSW',
        electorate: 'Sydney',
        chamber: 'House of Representatives',
        email: 'tanya.plibersek.mp@aph.gov.au',
        phone: '(02) 9357 6366',
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Environment and Water'],
        isMinister: true,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_6',
        fullName: 'Simon Birmingham',
        party: 'Liberal Party of Australia',
        suburb: 'Adelaide',
        state: 'SA',
        chamber: 'Senate',
        email: 'senator.birmingham@aph.gov.au',
        phone: '(08) 8354 0966',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Finance', 'Leader of the Opposition in the Senate'],
        isMinister: false,
        isShadowMinister: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_7',
        fullName: 'David Pocock',
        party: 'Independent',
        suburb: 'Canberra',
        state: 'ACT',
        chamber: 'Senate',
        email: 'senator.pocock@aph.gov.au',
        phone: '(02) 6277 3018',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Climate Action', 'Integrity'],
        isMinister: false,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fallback_8',
        fullName: 'Zali Steggall',
        party: 'Independent',
        suburb: 'Warringah',
        state: 'NSW',
        electorate: 'Warringah',
        chamber: 'House of Representatives',
        email: 'zali.steggall.mp@aph.gov.au',
        phone: '(02) 9977 6411',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        portfolios: ['Climate Action'],
        isMinister: false,
        isShadowMinister: false,
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  // Get member by ID
  getMemberById(id: string): ParliamentaryMember | undefined {
    return this.members.find(member => member.id === id);
  }

  // Search members by various criteria
  searchMembers(
    query: string, 
    state?: string, 
    party?: string, 
    chamber?: string
  ): ParliamentaryMember[] {
    return this.members.filter(member => {
      const matchesQuery = query === '' || 
        member.fullName.toLowerCase().includes(query.toLowerCase()) ||
        member.party.toLowerCase().includes(query.toLowerCase()) ||
        member.suburb.toLowerCase().includes(query.toLowerCase()) ||
        (member.electorate && member.electorate.toLowerCase().includes(query.toLowerCase())) ||
        member.portfolios.some(portfolio => portfolio.toLowerCase().includes(query.toLowerCase()));
      
      const matchesState = !state || state === 'All' || member.state === state;
      const matchesParty = !party || member.party === party;
      const matchesChamber = !chamber || member.chamber === chamber;
      
      return matchesQuery && matchesState && matchesParty && matchesChamber;
    });
  }

  // Get unique parties
  getUniqueParties(): string[] {
    const parties = new Set(this.members.map(member => member.party));
    return Array.from(parties).sort();
  }

  // Get unique chambers
  getUniqueChambers(): string[] {
    const chambers = new Set(
      this.members
        .map(member => member.chamber)
        .filter(chamber => chamber !== undefined)
    );
    return Array.from(chambers).sort();
  }

  // Get members by state
  getMembersByState(state: string): ParliamentaryMember[] {
    if (state === 'All') return [...this.members];
    return this.members.filter(member => member.state === state);
  }

  // Get members by party
  getMembersByParty(party: string): ParliamentaryMember[] {
    return this.members.filter(member => member.party === party);
  }

  // Get ministers
  getMinisters(): ParliamentaryMember[] {
    return this.members.filter(member => member.isMinister);
  }

  // Get shadow ministers
  getShadowMinisters(): ParliamentaryMember[] {
    return this.members.filter(member => member.isShadowMinister);
  }

  // Force update members data
  async updateMembersData(): Promise<boolean> {
    console.log('Force updating parliamentary members data...');
    
    try {
      await this.fetchMembers(true);
      console.log('Members data updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update members data:', error);
      return false;
    }
  }

  // Get update information
  getUpdateInfo(): DataUpdateInfo {
    return { ...this.updateInfo };
  }

  // Clear cache
  async clearCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(MEMBERS_CACHE_KEY),
        AsyncStorage.removeItem(UPDATE_INFO_KEY)
      ]);
      
      this.members = [];
      this.cacheLoaded = false;
      this.updateInfo = {
        lastUpdated: '',
        nextUpdate: '',
        updateInProgress: false,
        lastUpdateSuccess: false
      };
      
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const parliamentaryMembersService = ParliamentaryMembersService.getInstance();
