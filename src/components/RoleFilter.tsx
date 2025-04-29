import React from 'react';
import { PersonalityData } from '../types';
import FilterModeToggle from './FilterModeToggle';

interface RoleFilterProps {
  data: PersonalityData[];
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  isUnionMode: boolean;
  setIsUnionMode: (mode: boolean) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ 
  data, 
  selectedRoles, 
  setSelectedRoles,
  isUnionMode,
  setIsUnionMode
}) => {
  // Extract unique roles from the data
  const allRoles = React.useMemo(() => {
    const roleSet = new Set<string>();
    
    data.forEach(person => {
      if (person.roles) {
        // Split by comma and trim whitespace
        const personRoles = person.roles.split(',').map(role => role.trim());
        personRoles.forEach(role => {
          if (role) roleSet.add(role);
        });
      }
    });
    
    // Convert Set to sorted Array
    return Array.from(roleSet).sort();
  }, [data]);

  // No roles to filter if the list is empty
  if (allRoles.length === 0) {
    return null;
  }

  // Toggle role selection
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Clear all selected roles
  const clearAllRoles = () => {
    setSelectedRoles([]);
  };

  return (
    <div style={{
      marginBottom: '20px',
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto 20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Filter op rol{selectedRoles.length > 0 ? ` (${selectedRoles.length} geselecteerd)` : ''}</span>
        {selectedRoles.length > 0 && (
          <button
            onClick={clearAllRoles}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#555',
              fontSize: '14px',
              padding: '3px 8px',
              borderRadius: '4px',
              textDecoration: 'underline'
            }}
          >
            Wis alles
          </button>
        )}
      </div>

      {/* Add the FilterModeToggle when more than one role is selected */}
      {selectedRoles.length > 1 && (
        <div style={{ marginBottom: '12px' }}>
          <FilterModeToggle 
            isUnionMode={isUnionMode} 
            setIsUnionMode={setIsUnionMode}
          />
        </div>
      )}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {allRoles.map(role => (
          <div
            key={role}
            onClick={() => toggleRole(role)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: selectedRoles.includes(role) ? '#5C92F0' : '#f0f0f0',
              color: selectedRoles.includes(role) ? 'white' : '#333',
              transition: 'all 0.2s ease',
              border: '1px solid transparent',
              userSelect: 'none'
            }}
          >
            {role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(RoleFilter);