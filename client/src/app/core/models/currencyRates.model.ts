export interface CurrencyRatesModel {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

export const EmptyCurrencyRates = {
  success: false,
  timestamp: 0,
  base: '',
  date: '',
  rates: {},
}