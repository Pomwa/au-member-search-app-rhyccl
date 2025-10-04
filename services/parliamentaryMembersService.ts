
import { ParliamentaryMember } from '../types/ParliamentaryMember';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for demonstration - in a real app, this would come from an API
export const parliamentaryMembersData: ParliamentaryMember[] = [
  {
    id: '1',
    fullName: 'Anthony Albanese',
    party: 'Australian Labor Party',
    suburb: 'Marrickville',
    state: 'NSW',
    electorate: 'Grayndler',
    chamber: 'House of Representatives',
    email: 'anthony.albanese.mp@aph.gov.au',
    phone: '(02) 9564 3588',
  },
  {
    id: '2',
    fullName: 'Peter Dutton',
    party: 'Liberal Party of Australia',
    suburb: 'Dickson',
    state: 'QLD',
    electorate: 'Dickson',
    chamber: 'House of Representatives',
    email: 'peter.dutton.mp@aph.gov.au',
    phone: '(07) 3205 9977',
  },
  {
    id: '3',
    fullName: 'Adam Bandt',
    party: 'Australian Greens',
    suburb: 'Melbourne',
    state: 'VIC',
    electorate: 'Melbourne',
    chamber: 'House of Representatives',
    email: 'adam.bandt.mp@aph.gov.au',
    phone: '(03) 9417 0772',
  },
  {
    id: '4',
    fullName: 'Penny Wong',
    party: 'Australian Labor Party',
    suburb: 'Adelaide',
    state: 'SA',
    chamber: 'Senate',
    email: 'senator.wong@aph.gov.au',
    phone: '(08) 8354 0511',
  },
  {
    id: '5',
    fullName: 'Simon Birmingham',
    party: 'Liberal Party of Australia',
    suburb: 'Adelaide',
    state: 'SA',
    chamber: 'Senate',
    email: 'senator.birmingham@aph.gov.au',
    phone: '(08) 8354 0966',
  },
  {
    id: '6',
    fullName: 'Larissa Waters',
    party: 'Australian Greens',
    suburb: 'Brisbane',
    state: 'QLD',
    chamber: 'Senate',
    email: 'senator.waters@aph.gov.au',
    phone: '(07) 3252 7101',
  },
  {
    id: '7',
    fullName: 'Jacinta Nampijinpa Price',
    party: 'Country Liberal Party',
    suburb: 'Alice Springs',
    state: 'NT',
    chamber: 'Senate',
    email: 'senator.price@aph.gov.au',
    phone: '(08) 8951 4251',
  },
  {
    id: '8',
    fullName: 'David Pocock',
    party: 'Independent',
    suburb: 'Canberra',
    state: 'ACT',
    chamber: 'Senate',
    email: 'senator.pocock@aph.gov.au',
    phone: '(02) 6277 3018',
  },
  {
    id: '9',
    fullName: 'Zali Steggall',
    party: 'Independent',
    suburb: 'Warringah',
    state: 'NSW',
    electorate: 'Warringah',
    chamber: 'House of Representatives',
    email: 'zali.steggall.mp@aph.gov.au',
    phone: '(02) 9977 6411',
  },
  {
    id: '10',
    fullName: 'Pauline Hanson',
    party: 'One Nation',
    suburb: 'Brisbane',
    state: 'QLD',
    chamber: 'Senate',
    email: 'senator.hanson@aph.gov.au',
    phone: '(07) 3252 8066',
  },
  {
    id: '11',
    fullName: 'Tanya Plibersek',
    party: 'Australian Labor Party',
    suburb: 'Sydney',
    state: 'NSW',
    electorate: 'Sydney',
    chamber: 'House of Representatives',
    email: 'tanya.plibersek.mp@aph.gov.au',
    phone: '(02) 9357 6366',
  },
  {
    id: '12',
    fullName: 'Josh Frydenberg',
    party: 'Liberal Party of Australia',
    suburb: 'Kooyong',
    state: 'VIC',
    electorate: 'Kooyong',
    chamber: 'House of Representatives',
    email: 'josh.frydenberg.mp@aph.gov.au',
    phone: '(03) 9882 3677',
  },
  {
    id: '13',
    fullName: 'Richard Di Natale',
    party: 'Australian Greens',
    suburb: 'Melbourne',
    state: 'VIC',
    chamber: 'Senate',
    email: 'senator.dinatale@aph.gov.au',
    phone: '(03) 9417 6100',
  },
  {
    id: '14',
    fullName: 'Michaelia Cash',
    party: 'Liberal Party of Australia',
    suburb: 'Perth',
    state: 'WA',
    chamber: 'Senate',
    email: 'senator.cash@aph.gov.au',
    phone: '(08) 9226 1277',
  },
  {
    id: '15',
    fullName: 'Nick McKim',
    party: 'Australian Greens',
    suburb: 'Hobart',
    state: 'TAS',
    chamber: 'Senate',
    email: 'senator.mckim@aph.gov.au',
    phone: '(03) 6224 3707',
  },
];

const MEMBERS_CACHE_KEY = 'parliamentary_members_cache';

export class ParliamentaryMembersService {
  private static instance: ParliamentaryMembersService;
  private members: ParliamentaryMember[] = parliamentaryMembersData;
  private cacheLoaded = false;

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
      const cachedData = await AsyncStorage.getItem(MEMBERS_CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          this.members = parsedData;
          console.log(`Loaded ${parsedData.length} members from cache`);
        }
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
      await AsyncStorage.setItem(MEMBERS_CACHE_KEY, JSON.stringify(this.members));
      console.log('Members data cached successfully');
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  // Simulate API call to fetch all members
  async fetchMembers(): Promise<ParliamentaryMember[]> {
    console.log('Fetching parliamentary members from service...');
    
    // Load cached data first
    await this.loadCachedData();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an actual API call
    // const response = await fetch('https://api.parliament.gov.au/members');
    // const data = await response.json();
    
    return [...this.members];
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
        (member.electorate && member.electorate.toLowerCase().includes(query.toLowerCase()));
      
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

  // Simulate daily data update
  async updateMembersData(): Promise<boolean> {
    console.log('Updating parliamentary members data...');
    
    try {
      // Simulate API call to check for updates
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would fetch the latest data from the API
      // const response = await fetch('https://api.parliament.gov.au/members');
      // const updatedData = await response.json();
      // this.members = updatedData;
      
      // For demo purposes, we'll just refresh the existing data
      // and save it to cache
      await this.saveCachedData();
      
      console.log('Members data updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update members data:', error);
      return false;
    }
  }
}

export const parliamentaryMembersService = ParliamentaryMembersService.getInstance();
