export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export interface IHoroscopeCore {
  sign: ZodiacSign;
  date: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
  intensityPercent: number; 
}

export interface IDailyHoroscope extends IHoroscopeCore {
  personalLife: string;
  profession: string;
  health: string;
  travel: string;
}

export interface IExtendedHoroscope {
  sign: ZodiacSign;
  timeframe: "weekly" | "monthly" | "yearly";
  range: string; 
  overview: string;
  careerAndFinance: string;
  loveAndRelationships: string;
}