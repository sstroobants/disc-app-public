import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { PersonalityData } from '../types';

export const usePersonalityData = () => {
  const [data, setData] = useState<PersonalityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataLoaded = useRef(false);

  useEffect(() => {
    // Prevent double data loading
    if (dataLoaded.current) return;
    dataLoaded.current = true;
    
    const loadData = async () => {
      try {
        console.log('Fetching CSV data from local file...');
        const localCsvPath = '/data/personality_data.csv';
        const response = await fetch(localCsvPath);
        if (!response.ok) {
          throw new Error('Failed to fetch local CSV file');
        }
        const csvText = await response.text();
        
        Papa.parse<any>(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toLowerCase() || 'roles',
          transform: (value) => {
            if (value === '') return undefined;
            const num = Number(value);
            if (!isNaN(num)) return num;
            return value;
          },
          complete: (results) => {
            const validData = results.data
              .filter((row: any) => {
                const isValid = row.naam && 
                  typeof row.plotx === 'number' && !isNaN(row.plotx) && 
                  typeof row.ploty === 'number' && !isNaN(row.ploty);
                
                if (!isValid) {
                  console.log('Filtered out invalid row:', row);
                }
                return isValid;
              }) as PersonalityData[];

            setData(validData);
            setLoading(false);
          },
          error: (error: Error) => {
            console.error('CSV parsing error:', error);
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Data loading error:', err);
        setError('Failed to load data: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};