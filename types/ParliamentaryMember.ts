
export interface ParliamentaryMember {
  id: string;
  fullName: string;
  party: string;
  suburb: string;
  state: string;
  electorate?: string;
  chamber?: 'House of Representatives' | 'Senate';
  email?: string;
  phone?: string;
}

export interface ParliamentaryMemberSearchFilters {
  searchQuery: string;
  selectedState: string;
  selectedParty?: string;
  selectedChamber?: string;
}

export const AUSTRALIAN_STATES = [
  'All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'
] as const;

export type AustralianState = typeof AUSTRALIAN_STATES[number];
