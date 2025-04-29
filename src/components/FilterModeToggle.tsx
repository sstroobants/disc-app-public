import React from 'react';

interface FilterModeToggleProps {
  isUnionMode: boolean;
  setIsUnionMode: (mode: boolean) => void;
  disabled?: boolean;
}

const FilterModeToggle: React.FC<FilterModeToggleProps> = ({ 
  isUnionMode, 
  setIsUnionMode,
  disabled = false 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      <span style={{ fontSize: '14px', color: '#666' }}>Filter modus:</span>
      <div style={{
        display: 'flex',
        background: '#f0f0f0',
        borderRadius: '20px',
        padding: '4px',
        gap: '4px'
      }}>
        <button
          onClick={() => setIsUnionMode(true)}
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            border: 'none',
            background: isUnionMode ? '#5C92F0' : 'transparent',
            color: isUnionMode ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: isUnionMode ? '500' : '400',
            transition: 'all 0.2s ease'
          }}
        >
          OF
        </button>
        <button
          onClick={() => setIsUnionMode(false)}
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            border: 'none',
            background: !isUnionMode ? '#5C92F0' : 'transparent',
            color: !isUnionMode ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: !isUnionMode ? '500' : '400',
            transition: 'all 0.2s ease'
          }}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default React.memo(FilterModeToggle);