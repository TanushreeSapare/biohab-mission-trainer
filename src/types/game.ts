export type SiteId = 'lunar' | 'mars';

export type GameScreen = 'briefing' | 'mission' | 'success' | 'abort';

export type BotMood = 'happy' | 'excited' | 'worried' | 'alert';

export type ResourceKey = 'power' | 'bio' | 'shield';

export interface ResourceState {
  power: number;
  bio: number;
  shield: number;
}

export interface SiteConfig {
  id: SiteId;
  name: string;
  subtitle: string;
  locationLabel: string;
  description: string;
  sunlightNote: string;
  hazardNote: string;
  gravityLabel: string;
  distanceLabel: string;
  accentColor: string;
}

export type HazardVisualType =
  | 'normal'
  | 'dust'
  | 'solar_storm'
  | 'algae_bloom'
  | 'deep_shadow'
  | 'micrometeorite'
  | 'cold_snap';

export interface SolEvent {
  sol: number;
  title: string;
  summary: string;
  hazardType: HazardVisualType;
  passiveDelta: ResourceState;
  botPrompt: string;
  scienceContext: string;
}

export type CardIconId =
  | 'led'
  | 'water_wall'
  | 'algae'
  | 'dust_repeller'
  | 'solar_tilt'
  | 'regolith'
  | 'aeroponics'
  | 'sabatier'
  | 'battery'
  | 'shield_pulse'
  | 'myco'
  | 'filter_flush';

export interface DecisionCard {
  id: string;
  title: string;
  icon: CardIconId;
  description: string;
  effects: ResourceState;
  scienceBite: string;
  tag: string;
}

export interface SolHistoryEntry {
  sol: number;
  resources: ResourceState;
  eventTitle: string;
  chosenTitles: string[];
}

export interface FailureDiagnosis {
  failedResource: ResourceKey;
  title: string;
  cascadeExplanation: string;
  tip: string;
}
