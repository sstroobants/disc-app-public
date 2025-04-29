import { useMemo } from 'react';
import { PersonalityData } from '../types';

export const useFilteredData = (
  data: PersonalityData[],
  searchTerm: string,
  selectedRoles: string[],
  isUnionMode: boolean
) => {
  // Filtered data based on search term and roles
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter(person => {
      // Filter by search term (if any)
      const matchesSearch = !searchTerm || 
        person.naam.toLowerCase().startsWith(searchTerm.toLowerCase());
      
      // Filter by selected roles (if any)
      const matchesRoles = selectedRoles.length === 0 || (person.roles && (
        isUnionMode
          // Union (OR) mode: person has at least one of the selected roles
          ? selectedRoles.some(role => person.roles?.split(',').map(r => r.trim()).includes(role))
          // Intersection (AND) mode: person has all selected roles
          : selectedRoles.every(role => person.roles?.split(',').map(r => r.trim()).includes(role))
      ));
      
      // Return true if the person matches both filters
      return matchesSearch && matchesRoles;
    });
  }, [data, searchTerm, selectedRoles, isUnionMode]);

  // Calculate matching names for search dropdown
  const matchingNames = useMemo(() => {
    if (!searchTerm || !data || data.length === 0) return [];
    
    // Get all names that match the search term
    const matches = data
      .filter(person => 
        person.naam.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      // Sort by how closely they match (exact match first, then starts with)
      .sort((a, b) => {
        const aName = a.naam.toLowerCase();
        const bName = b.naam.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        // Exact match gets top priority
        if (aName === term && bName !== term) return -1;
        if (bName === term && aName !== term) return 1;
        
        // Starts with gets second priority
        if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
        if (bName.startsWith(term) && !aName.startsWith(term)) return 1;
        
        // Default to alphabetical order
        return aName.localeCompare(bName);
      })
      // Limit to 10 results to keep dropdown manageable
      .slice(0, 10);
    
    return matches;
  }, [data, searchTerm]);

  // Calculate filtered count for search term
  const searchMatchCount = searchTerm 
    ? filteredData.filter(person => person.naam.toLowerCase().startsWith(searchTerm.toLowerCase())).length 
    : 0;

  return { filteredData, matchingNames, searchMatchCount };
};