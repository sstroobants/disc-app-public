import React from 'react';

interface PlotControlsProps {
  minDistance: number;
  setMinDistance: (value: number) => void;
  repulsionStrength: number;
  setRepulsionStrength: (value: number) => void;
}

const PlotControls: React.FC<PlotControlsProps> = ({
  minDistance,
  setMinDistance,
  repulsionStrength,
  setRepulsionStrength
}) => {
  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '15px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px' }}>Adjust Collision Parameters</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label htmlFor="min-distance" style={{ width: '180px', marginRight: '10px' }}>
          Minimum Distance: {minDistance}
        </label>
        <input
          id="min-distance"
          type="range"
          min="15"
          max="50"
          step="1"
          value={minDistance}
          onChange={(e) => setMinDistance(Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="repulsion-strength" style={{ width: '180px', marginRight: '10px' }}>
          Repulsion Strength: {repulsionStrength}
        </label>
        <input
          id="repulsion-strength"
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={repulsionStrength}
          onChange={(e) => setRepulsionStrength(Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
};

export default React.memo(PlotControls);