import { PersonalityData } from '../types';

// Interface for plot item with coordinates
export interface PlotItem {
  person: PersonalityData;
  x: number;
  y: number;
  width: number;
  height: number;
  // Track if this point has been adjusted for collision
  adjusted?: boolean;
}

// Calculates plot positions for data points
export function calculatePlotPositions(data: PersonalityData[], width: number, height: number): PlotItem[] {
  return data.map(person => {
    // Validate coordinates - if undefined, NaN, or not a number, use center of plot
    const validX = typeof person.plotx === 'number' && !isNaN(person.plotx);
    const validY = typeof person.ploty === 'number' && !isNaN(person.ploty);
    
    // Scale coordinates to fit within the plot, defaulting to center if invalid
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
}

// Check if two points are too close to each other based on center distance only
export function areCentersTooClose(p1: PlotItem, p2: PlotItem, minDistance: number): boolean {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < minDistance;
}

// Adjust positions to prevent center overlaps
export function resolveCollisions(
  plotItems: PlotItem[], 
  minDistance: number
): PlotItem[] {
  // Reduced number of maximum iterations
  const MAX_ITERATIONS = 20;
  
  // Create a copy we can modify
  const adjustedItems = [...plotItems];
  let hasCollisions = true;
  let iterations = 0;
  
  while (hasCollisions && iterations < MAX_ITERATIONS) {
    hasCollisions = false;
    iterations++;
    
    // Check each pair of points for collisions
    for (let i = 0; i < adjustedItems.length; i++) {
      for (let j = i + 1; j < adjustedItems.length; j++) {
        if (areCentersTooClose(adjustedItems[i], adjustedItems[j], minDistance)) {
          hasCollisions = true;
          
          // Calculate direction vector from i to j
          let dx = adjustedItems[j].x - adjustedItems[i].x;
          let dy = adjustedItems[j].y - adjustedItems[i].y;
          
          // Calculate distance between centers
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          // Handle case where points are exactly on top of each other
          if (distance === 0 || isNaN(distance)) {
            // Generate random angle
            const angle = Math.random() * Math.PI * 2;
            
            // Create unit vector from random angle
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            
            // Apply a small fixed movement for overlapping points
            // Instead of calculating based on the tiny distance
            const randomMoveDistance = minDistance / 2;
            
            // Move points apart along the random direction vector
            adjustedItems[i] = {
              ...adjustedItems[i],
              x: adjustedItems[i].x - dx * (randomMoveDistance / 2),
              y: adjustedItems[i].y - dy * (randomMoveDistance / 2),
              adjusted: true
            };
            
            adjustedItems[j] = {
              ...adjustedItems[j],
              x: adjustedItems[j].x + dx * (randomMoveDistance / 2),
              y: adjustedItems[j].y + dy * (randomMoveDistance / 2),
              adjusted: true
            };
            
            console.log(`Applied random movement to overlapping points (${adjustedItems[i].person.naam}, ${adjustedItems[j].person.naam})`);
            
            // Skip the regular movement calculation
            continue;
          }
          
          // Get normalized direction vector
          let unitDx = dx / distance;
          let unitDy = dy / distance;
          
          // Add a small random perturbation to break symmetry
          // This prevents points in a straight line from oscillating back and forth
          const perturbationAmount = 0.15; // 15% random variation
          const angleOffset = (Math.random() - 0.5) * perturbationAmount * Math.PI;
          
          // Rotate the unit vector by a small random angle
          const newUnitDx = unitDx * Math.cos(angleOffset) - unitDy * Math.sin(angleOffset);
          const newUnitDy = unitDx * Math.sin(angleOffset) + unitDy * Math.cos(angleOffset);
          unitDx = newUnitDx;
          unitDy = newUnitDy;
          
          // Calculate how much to move each point to resolve collision
          const moveDistance = minDistance - distance;
          
          // Move points apart along the direction vector
          adjustedItems[i] = {
            ...adjustedItems[i],
            x: adjustedItems[i].x - unitDx * (moveDistance / 2),
            y: adjustedItems[i].y - unitDy * (moveDistance / 2),
            adjusted: true
          };
          
          adjustedItems[j] = {
            ...adjustedItems[j],
            x: adjustedItems[j].x + unitDx * (moveDistance / 2),
            y: adjustedItems[j].y + unitDy * (moveDistance / 2),
            adjusted: true
          };
        }
      }
    }
    
    if (iterations === MAX_ITERATIONS && hasCollisions) {
      console.warn(`Collision resolution stopped after ${MAX_ITERATIONS} iterations, some center overlaps may remain`);
    }
  }
  
  console.log(`Collision resolution completed in ${iterations} iterations`);
  return adjustedItems;
}