export interface DateRange {
  startDate: Moment;
  endDate: Moment;
}

export interface MinMaxRange {
  [dayMonth: string]: {
    min: number;
    max: number;
  };
}

export interface MinMaxAreaRangeData {
  minMaxRange: MinMaxRange;
  currentYearValues: { date: string; value: number }[];
}

export interface WeeklyData {
  [isoWeek: string]: {
    total: number;
    count: number;
  };
}

export interface WeeklyAverage {
  week: string;
  average: number;
}

export interface MonthlyData {
  [monthYear: string]: {
    total: number;
    count: number;
  };
}

export interface MonthlyAverage {
  month: string;
  average: number;
}
