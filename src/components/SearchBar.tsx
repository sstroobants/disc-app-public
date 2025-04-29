import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PersonalityData } from '../types';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  matchingNames?: PersonalityData[];
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, matchingNames = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize handler functions to prevent unnecessary re-renders
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }, []);

  const handleNameSelect = useCallback((name: string) => {
    setSearchTerm(name);
    setShowDropdown(false);
    // Focus back on input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setSearchTerm]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setSearchTerm]);

  const handleInputFocus = useCallback(() => {
    if (searchTerm && matchingNames.length > 0) {
      setShowDropdown(true);
    }
  }, [searchTerm, matchingNames.length]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Show dropdown when search term is entered and there are matching names
  useEffect(() => {
    if (searchTerm && matchingNames.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, matchingNames]);

  // Extracted style objects for better readability and reuse
  const containerStyle = {
    marginBottom: '20px',
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto 20px',
    position: 'relative' as const
  };

  const searchBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '25px',
    padding: '8px 15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '16px',
    fontFamily: 'inherit',
    color: '#333'
  };

  const clearButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    color: '#888',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={searchBoxStyle}>
        {/* Search icon */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#888" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ marginRight: '10px' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        
        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Zoek op naam..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
          onFocus={handleInputFocus}
        />
        
        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            style={clearButtonStyle}
            aria-label="Clear search"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#888" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {showDropdown && matchingNames.length > 0 && (
        <div ref={dropdownRef}>
          <SearchDropdown 
            matchingNames={matchingNames} 
            onSelectName={handleNameSelect} 
          />
        </div>
      )}

      {/* Add CSS for animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

// Extract dropdown to a separate component for better organization
interface SearchDropdownProps {
  matchingNames: PersonalityData[];
  onSelectName: (name: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ matchingNames, onSelectName }) => {
  const dropdownStyle = {
    position: 'absolute' as const,
    top: 'calc(100% + 5px)',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    zIndex: 100,
    maxHeight: '300px',
    overflowY: 'auto' as const,
    animation: 'fadeIn 0.2s ease-in-out'
  };

  const listStyle = {
    listStyle: 'none' as const,
    padding: '5px 0',
    margin: 0
  };

  return (
    <div style={dropdownStyle}>
      <ul style={listStyle}>
        {matchingNames.map((person, index) => (
          <SearchDropdownItem 
            key={index}
            person={person}
            isLast={index === matchingNames.length - 1}
            onSelect={onSelectName}
          />
        ))}
      </ul>
    </div>
  );
};

// Further extract dropdown item for even better component organization
interface SearchDropdownItemProps {
  person: PersonalityData;
  isLast: boolean;
  onSelect: (name: string) => void;
}

const SearchDropdownItem: React.FC<SearchDropdownItemProps> = ({ person, isLast, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const itemStyle = {
    padding: '8px 15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isHovered ? '#f5f5f5' : 'transparent'
  };
  
  // Fix the imageStyle to use conditional rendering instead of null assignment
  const hasImage = Boolean(person.foto);
  const imageStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '10px',
    backgroundImage: person.foto ? `url('/fotos/${person.foto}.png')` : 'none',
    backgroundSize: '140%',
    backgroundPosition: '50% 10%',
    flexShrink: 0 as const,
    display: hasImage ? 'block' : 'none'
  };
  
  const roleStyle = {
    fontSize: '12px',
    color: '#888',
    marginLeft: '8px'
  };

  return (
    <li 
      onClick={() => onSelect(person.naam)}
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageStyle} />
      <span>{person.naam}</span>
      {person.roles && (
        <span style={roleStyle}>
          ({person.roles})
        </span>
      )}
    </li>
  );
};

export default React.memo(SearchBar);