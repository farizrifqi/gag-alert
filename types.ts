export interface Stock {
  name: string;
  value: string;
  image?: string;
}
export interface EggStock extends Stock {
  emoji: string;
}
export interface GearStock extends Stock {
  emoji?: string;
}
export interface SeedsStock extends Stock {
  emoji: string;
}
export interface NightStock extends Stock {}
export interface HoneyStock extends Stock {}
export interface CostmeticsStock extends Stock {}

export interface GetStockResponse {
  gearStock: GearStock[];
  eggStock: EggStock[];
  seedsStock: SeedsStock[];
  easterStock: NightStock[];
  honeyStock: HoneyStock[];
  cosmeticsStock: CostmeticsStock[];
}
export interface Weather {
  weather_id: string;
  active: boolean;
  duration: number;
  start_duration_unix: number;
  end_duration_unix: number;
  weather_name: string;
}
export interface WeatherResponse {
  success: boolean;
  weater: Weather[];
}
export interface RestockTime {
  timestamp: number;
  countdown: string;
  LastRestock: string;
  timeSinceLastRestock: string;
}
export interface RestockTimeResponse {
  egg: RestockTime;
  gear: RestockTime;
  seeds: RestockTime;
  cosmetic: RestockTime;
  Event: RestockTime;
}
