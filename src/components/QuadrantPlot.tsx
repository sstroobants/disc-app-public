import React, { useEffect, useState, useRef } from 'react';
import { PersonalityData } from '../types';
import { useFilteredData } from '../utils/useFilteredData';
import { useImagePreloader } from '../utils/useImagePreloader';
import { usePlotPositions } from '../utils/usePlotPositions';
import PlotPoint from './PlotPoint';
import PlotBackground from './PlotBackground';

interface QuadrantPlotProps {
  data: PersonalityData[];
  searchTerm: string;
  selectedRoles: string[];
  isUnionMode: boolean;
}

const QuadrantPlot: React.FC<QuadrantPlotProps> = ({ 
  data, 
  searchTerm,
  selectedRoles,
  isUnionMode
}) => {
  // Use custom hooks for filtering, image preloading, and plot positions
  const { filteredData } = useFilteredData(data, searchTerm, selectedRoles, isUnionMode);
  const { imageErrors } = useImagePreloader(data);
  
  // Plot dimensions
  const width = 800;
  const height = 800;
  
  const { plotItemsToRender } = usePlotPositions(data, width, height);
  
  // Refs for tracking SVG and container
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Offsets for positioning points
  const [offsets, setOffsets] = useState({ left: 0, top: 0 });
  
  // Effect to adjust element positions when the SVG or window size changes
  useEffect(() => {
    const adjustPositions = () => {
      if (!svgRef.current || !containerRef.current) return;
      
      // Get the SVG element's bounding client rect
      const svgRect = svgRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the offset between SVG and its container
      const offsetLeft = svgRect.left - containerRect.left;
      const offsetTop = svgRect.top - containerRect.top;
      
      setOffsets({ left: offsetLeft, top: offsetTop });
    };
    
    // Run initially and add resize listener
    adjustPositions();
    window.addEventListener('resize', adjustPositions);
    
    // Clean up
    return () => window.removeEventListener('resize', adjustPositions);
  }, []);

  return (
    <div ref={containerRef} style={{ overflow: 'auto', margin: '20px', position: 'relative' }}>
      {/* Plot Background Component - always render regardless of data */}
      <PlotBackground 
        width={width} 
        height={height} 
        svgRef={svgRef as React.RefObject<SVGSVGElement>}
      />

      {/* Only render plot points if we have data */}
      {plotItemsToRender.length > 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          {plotItemsToRender.map((plotItem) => (
            <PlotPoint
              key={`person-${plotItem.person.naam}`} // Use stable key based on name
              person={plotItem.person}
              x={plotItem.x}
              y={plotItem.y}
              offsetLeft={offsets.left}
              offsetTop={offsets.top}
              imageErrors={imageErrors}
              searchTerm={searchTerm}
              selectedRoles={selectedRoles}
              isUnionMode={isUnionMode}
              isOnlyVisible={filteredData.length === 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(QuadrantPlot);