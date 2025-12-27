export type ZodiacPosition = {
  longitude: number;
  sign: string;
  signIndex: number;
  degreeInsideSign: number;
};

export type PlanetPosition = ZodiacPosition;

export type HouseCusp = {
  house: number;
  longitude: number;
  sign: string;
  signIndex: number;
  degreeInsideSign: number;
};

export type PlanetHouseAssignment = {
  [planetName: string]: number;
};

export type Aspect = {
  body1: string;
  body2: string;
  angle: number;
  type: string;
  orb: number;
};

export type ChartInterpretation = {
  corePersonality: string[];
  career: string[];
  relationships: string[];
  challenges: string[];
  strengths: string[];
};

export type ChartData = {
  utc: string;
  ist?: string;
  planets: Record<string, PlanetPosition>;
  ascendant: ZodiacPosition | null;
  houses: HouseCusp[] | null;
  planetHouses?: PlanetHouseAssignment;
  aspects: Aspect[];
  houseSystem?: string;
  interpretations?: ChartInterpretation;
};

