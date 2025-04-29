import { useState, useRef, useEffect } from 'react';
import { PersonalityData } from '../types';
import { calculatePlotPositions, resolveCollisions, PlotItem } from './plotUtils';

export const usePlotPositions = (data: PersonalityData[], width: number, height: number) => {
  // State for plot positioning - store all adjusted positions by name for stability
  const [adjustedPositions, setAdjustedPositions] = useState<Record<string, {x: number, y: number}>>({});
  
  // State for plot items to render
  const [plotItemsToRender, setPlotItemsToRender] = useState<PlotItem[]>([]);
  
  // Using a more appropriate minimum distance for point centers
  const minDistance = 20;
  
  // Refs for tracking state
  const initialPositionsSet = useRef(false);
  
  // Initial collision resolution - only run once for the full dataset
  useEffect(() => {
    // We only want to do the full collision resolution once with the complete dataset
    // to establish stable positions for all points
    if (initialPositionsSet.current) {
      return;
    }
    
    // We need the full dataset to properly initialize
    const fullData = data.length > 0 ? data : null;
    if (!fullData) return;
    
    const fullDataPlotItems = calculatePlotPositions(fullData, width, height);
    
    // Do the collision resolution once for all points
    const adjustedItems = resolveCollisions(fullDataPlotItems, minDistance);
    
    // Create a lookup of stable positions by person name
    const newPositions: Record<string, {x: number, y: number}> = {};
    adjustedItems.forEach(item => {
      newPositions[item.person.naam] = { x: item.x, y: item.y };
    });
    
    // Save these stable positions
    setAdjustedPositions(newPositions);
    initialPositionsSet.current = true;
    
    console.log("Initial stable positions set for all points");
  }, [data, minDistance, width, height]);
  
  // Update visible plot items whenever filtered data or positions change
  useEffect(() => {
    // Always clear plot items when data is empty
    if (!data || data.length === 0) {
      setPlotItemsToRender([]);
      return;
    }
    
    // Skip if positions haven't been initialized yet
    if (!initialPositionsSet.current) return;
    
    // Create plot items using stable positions where available
    const items = data.map(person => {
      const stablePosition = adjustedPositions[person.naam];
      
      // If we have stored a stable position for this person, use it
      if (stablePosition) {
        return {
          person,
          x: stablePosition.x,
          y: stablePosition.y,
          width,
          height
        };
      } 
      
      // Fallback to calculated position (should rarely happen)
      const validX = typeof person.plotx === 'number' && !isNaN(person.plotx);
      const validY = typeof person.ploty === 'number' && !isNaN(person.ploty);
      
      const x = width/2 + ((validX ? person.plotx : 0) * width/2);
      const y = height/2 - ((validY ? person.ploty : 0) * height/2);
      
      return {
        person,
        x,
        y,
        width,
        height
      };
    });
    
    setPlotItemsToRender(items);
  }, [data, adjustedPositions, width, height]);

  return { plotItemsToRender };
};