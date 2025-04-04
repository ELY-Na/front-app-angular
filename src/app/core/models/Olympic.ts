export interface Olympic {
    id: number;
    country: string;
    medalsCount: number;
    participations: Participation[]; // Liste des participations
}

export interface OlympicData {
  labels: string[];
  data: number[];
  ids: number[];
}

export interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number;
}
