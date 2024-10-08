export interface TimeSeriesDailyData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface TimeSeriesData {
  [date: string]: TimeSeriesDailyData;
}
