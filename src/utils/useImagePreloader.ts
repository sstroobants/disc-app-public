import { useState, useRef, useEffect } from 'react';
import { PersonalityData } from '../types';

export const useImagePreloader = (data: PersonalityData[]) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const allImagesChecked = useRef(false);

  // Preload all images in a single batch
  useEffect(() => {
    if (!data || data.length === 0 || allImagesChecked.current) return;
    
    const errors: Record<string, boolean> = {};
    const loaded: Record<string, boolean> = {};
    
    // Create and check all images at once
    data.forEach(person => {
      // Make sure person.foto exists and is a string before calling trim()
      if (!person.foto || typeof person.foto !== 'string' || person.foto.trim() === '') return;
      
      const img = new Image();
      img.onload = () => {
        loaded[person.naam] = true;
        updateStatus();
      };
      img.onerror = () => {
        errors[person.naam] = true;
        updateStatus();
      };
      img.src = `/fotos/${person.foto}.png`;
    });
    
    // Only update state once all images are checked
    function updateStatus() {
      const total = Object.keys(errors).length + Object.keys(loaded).length;
      const expected = data.filter(p => p.foto && typeof p.foto === 'string' && p.foto.trim() !== '').length;
      
      if (total === expected) {
        setImageErrors(errors);
        allImagesChecked.current = true;
      }
    }
  }, [data]);

  return { imageErrors };
};