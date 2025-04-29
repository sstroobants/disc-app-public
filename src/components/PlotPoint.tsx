import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PersonalityData } from '../types';

interface PlotPointProps {
  person: PersonalityData;
  x: number;
  y: number;
  offsetLeft: number;
  offsetTop: number;
  imageErrors: Record<string, boolean>;
  searchTerm: string;
  selectedRoles: string[];
  isUnionMode: boolean;
  isOnlyVisible: boolean;
}

const PlotPoint: React.FC<PlotPointProps> = ({ 
  person, 
  x, 
  y, 
  offsetLeft, 
  offsetTop,
  imageErrors,
  searchTerm,
  selectedRoles,
  isUnionMode,
  isOnlyVisible
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  // State to determine popup position for edge detection
  const [popupPosition, setPopupPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  // Memoize the visibility check to avoid recalculations
  const matchesFilters = useMemo(() => {
    // Only match names that start with the search term
    const matchesSearch = !searchTerm || person.naam.toLowerCase().startsWith(searchTerm.toLowerCase());
    
    // Check if person matches role filters
    const matchesRoles = selectedRoles.length === 0 || (person.roles && (
      isUnionMode
        ? selectedRoles.some(role => person.roles?.split(',').map(r => r.trim()).includes(role))
        : selectedRoles.every(role => person.roles?.split(',').map(r => r.trim()).includes(role))
    ));

    return matchesSearch && matchesRoles;
  }, [searchTerm, selectedRoles, isUnionMode, person.naam, person.roles]);

  // Effect to handle visibility changes with animation
  useEffect(() => {
    if (matchesFilters && !isVisible) {
      // Show the point
      setShouldRender(true);
      // Use setTimeout to ensure DOM updates before starting animation
      setTimeout(() => setIsVisible(true), 50);
    } else if (!matchesFilters && isVisible) {
      // Hide the point with animation
      setIsVisible(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [matchesFilters, isVisible]);

  // Show popup when it's the only visible point or when hovered
  const showPopup = isHovered || (isOnlyVisible && isVisible);
  
  // Use enhanced state that considers both hover and search result status
  const isEnhanced = isHovered || (isOnlyVisible && isVisible);

  // Determine popup position based on coordinates - memoized to avoid unnecessary calculations
  useEffect(() => {
    if (!showPopup) return;

    // Plot dimensions
    const plotWidth = 800;
    const plotHeight = 800;
    
    // Determine edge proximity using percentages of the plot size
    const leftEdge = x < plotWidth * 0.25;
    const rightEdge = x > plotWidth * 0.75;
    const topEdge = y < plotHeight * 0.2;

    // Adjust position based on edge proximity
    if (topEdge) {
      setPopupPosition('bottom');
    } else if (leftEdge) {
      setPopupPosition('right');
    } else if (rightEdge) {
      setPopupPosition('left');
    } else {
      setPopupPosition('top');
    }
  }, [showPopup, x, y]);

  // Event handlers with useCallback to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!shouldRender) return null;

  // Determine if we have a valid photo
  const hasValidPhoto = person.foto && !imageErrors[person.naam];

  // Memoize the border style calculation
  const getBorderStyle = () => {
    let borderColor = '';
    let highestValue = 0;
    
    if (person.regisseur !== undefined && person.regisseur >= 18 && person.regisseur > highestValue) {
      borderColor = '#DA4953';
      highestValue = person.regisseur;
    }
    
    if (person.motivator !== undefined && person.motivator >= 18 && person.motivator > highestValue) {
      borderColor = '#e8b12d';
      highestValue = person.motivator;
    }
    
    if (person.zorger !== undefined && person.zorger >= 18 && person.zorger > highestValue) {
      borderColor = '#43A390';
      highestValue = person.zorger;
    }
    
    if (person.analyticus !== undefined && person.analyticus >= 18 && person.analyticus > highestValue) {
      borderColor = '#5C92F0';
    }
    
    return borderColor ? `3px solid ${borderColor}` : '1px solid #f0f0f0';
  };

  // Photo or initials style
  const contentStyle = {
    width: isEnhanced ? '64px' : '44px',
    height: isEnhanced ? '64px' : '44px',
    borderRadius: '50%',
    transition: 'all 0.2s ease-in-out',
    ...(hasValidPhoto 
      ? {
          backgroundImage: `url(/fotos/${person.foto}.png)`,
          backgroundSize: '140%',
          backgroundPosition: '50% 10%',
        } 
      : {
          backgroundColor: '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: isEnhanced ? '16px' : '14px',
          fontWeight: 'bold',
          color: '#333',
        })
  } as React.CSSProperties;

  // Calculate base styles for the point
  const pointStyle = {
    position: 'absolute',
    left: `${x + offsetLeft}px`,
    top: `${y + offsetTop}px`,
    width: isEnhanced ? '70px' : '50px',
    height: isEnhanced ? '70px' : '50px',
    marginLeft: isEnhanced ? '-35px' : '-25px',
    marginTop: isEnhanced ? '-35px' : '-25px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isEnhanced ? '0px 3px 6px rgba(0,0,0,0.5)' : '0px 2px 3px rgba(0,0,0,0.3)',
    zIndex: isEnhanced ? 40 : 10,
    pointerEvents: 'auto',
    transition: 'all 0.2s ease-out',
    cursor: 'pointer',
    border: getBorderStyle(),
    opacity: isVisible ? 1 : 0,
    transform: `scale(${isVisible ? (isEnhanced ? 1.1 : 1) : 0.8})`
  } as React.CSSProperties;

  // Get popup style based on position
  const getPopupStyle = () => {
    const baseStyle = {
      backgroundColor: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      whiteSpace: 'nowrap',
      fontSize: '18px',
      color: '#333',
      fontWeight: 'normal',
      minWidth: '180px',
      position: 'absolute',
      zIndex: 50,
      opacity: 1,
      transition: 'opacity 0.15s ease-out',
    } as React.CSSProperties;

    // Add position-specific styles
    switch (popupPosition) {
      case 'bottom':
        return {
          ...baseStyle,
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          ...baseStyle,
          top: '50%',
          right: '80px',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          ...baseStyle,
          top: '50%',
          left: '80px',
          transform: 'translateY(-50%)',
        };
      case 'top':
      default:
        return {
          ...baseStyle,
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  // Get arrow style based on position
  const getArrowStyle = () => {
    const baseStyle = {
      position: 'absolute',
      width: '0',
      height: '0',
    } as React.CSSProperties;

    // Add position-specific styles
    switch (popupPosition) {
      case 'bottom':
        return {
          ...baseStyle,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid white',
        };
      case 'left':
        return {
          ...baseStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '6px solid white',
        };
      case 'right':
        return {
          ...baseStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '6px solid white',
        };
      case 'top':
      default:
        return {
          ...baseStyle,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid white',
        };
    }
  };

  // Generate personality score display
  const renderPersonalityScores = () => {
    const styles = {
      gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '6px 20px',
        textAlign: 'left' as const
      },
      score: {
        marginLeft: '6px'
      }
    };

    return (
      <div style={styles.gridContainer}>
        <div>
          <span style={{ color: '#BD8A00' }}>Motivator:</span>
          <span style={styles.score}>{person.motivator !== undefined ? person.motivator : '-'}</span>
        </div>
        <div>
          <span style={{ color: '#16836B' }}>Zorger:</span>
          <span style={styles.score}>{person.zorger !== undefined ? person.zorger : '-'}</span>
        </div>
        <div>
          <span style={{ color: '#D73C47' }}>Regisseur:</span>
          <span style={styles.score}>{person.regisseur !== undefined ? person.regisseur : '-'}</span>
        </div>
        <div>
          <span style={{ color: '#2870EB' }}>Analyticus:</span>
          <span style={styles.score}>{person.analyticus !== undefined ? person.analyticus : '-'}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      role="button"
      aria-label={`Persoonlijkheidsprofiel van ${person.naam}`}
      title={person.naam}
      style={pointStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsHovered(!isHovered);
        }
      }}
    >
      {/* If we have a valid photo, show it, otherwise show initials */}
      <div style={contentStyle} aria-hidden="true">
        {!hasValidPhoto && (person.naam ? person.naam.charAt(0) : '?')}
      </div>

      {/* Show popup when it's the only visible point or when hovered */}
      {showPopup && (
        <div 
          style={getPopupStyle()}
          role="tooltip"
          aria-live="polite"
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{person.naam}</div>
          {renderPersonalityScores()}
          
          {/* Arrow - position changes based on popup position */}
          <div style={getArrowStyle()} aria-hidden="true"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PlotPoint);