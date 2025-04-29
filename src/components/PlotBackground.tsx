import React from 'react';

interface PlotBackgroundProps {
  width: number;
  height: number;
  svgRef: React.RefObject<SVGSVGElement>;
}

const PlotBackground: React.FC<PlotBackgroundProps> = ({ width, height, svgRef }) => {
  return (
    <svg 
      ref={svgRef}
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ minWidth: '600px', border: '2px solid #333', borderRadius: '4px' }}
    >
      {/* Background image */}
      <image href="/background.png" width={width} height={height} x="0" y="0" />

      {/* Quadrant labels */}
      <text 
        x={30} 
        y={40} 
        fontSize="24" 
        fontWeight="bold" 
        fill="black"
      >
        Motivator
      </text>
      <text 
        x={width - 30} 
        y={40} 
        fontSize="24" 
        fontWeight="bold" 
        textAnchor="end" 
        fill="black"
      >
        Zorger
      </text>
      <text 
        x={30} 
        y={height - 20} 
        fontSize="24" 
        fontWeight="bold" 
        fill="black"
      >
        Regisseur
      </text>
      <text 
        x={width - 30} 
        y={height - 20} 
        fontSize="24" 
        fontWeight="bold" 
        textAnchor="end" 
        fill="black"
      >
        Analyticus
      </text>
    </svg>
  );
};

export default React.memo(PlotBackground);