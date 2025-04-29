export interface PersonalityData {
  naam: string;
  plotx: number;
  ploty: number;
  foto?: string;
  motivator?: number;
  regisseur?: number;
  analyticus?: number;
  zorger?: number;
  roles?: string; // Added roles field that contains comma-separated role values
}