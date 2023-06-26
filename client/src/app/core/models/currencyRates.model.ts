export interface CurrencyRatesModel {
  success: boolean;
  backup?: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
  error?: { code?: number, type?: string, info?: string };
}

export const EmptyCurrencyRates = {
  success: false,
  timestamp: 0,
  base: '',
  date: '',
  rates: {},
}