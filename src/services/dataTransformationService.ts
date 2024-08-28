import { fetchData } from "@/services/apiService";
import { TimeSeriesData } from "@/types/api";
import {
  MinMaxAreaRangeData,
  WeeklyAverage,
  WeeklyData,
  MonthlyAverage,
  MonthlyData,
} from "@/types/app";
import moment, { Moment } from "moment";

class dataTransformationService {
  private static instance: dataTransformationService;
  private data: TimeSeriesData | null = null;
  private dataLoadedPromise: Promise<void>;
  private resolveDataLoaded: (() => void) | null = null;

  private constructor() {
    this.dataLoadedPromise = new Promise((resolve) => {
      this.resolveDataLoaded = resolve;
    });
  }

  public static getInstance(): dataTransformationService {
    if (!dataTransformationService.instance) {
      dataTransformationService.instance = new dataTransformationService();
    }
    return dataTransformationService.instance;
  }

  public async loadData(symbol = "AAPL"): Promise<void> {
    if (this.data === null) {
      try {
        this.data = await fetchData(symbol);
        console.log("Data fetched from API");
        if (this.resolveDataLoaded) {
          this.resolveDataLoaded();
          this.resolveDataLoaded = null;
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    } else {
      console.log("Data loaded from cache");
    }
  }

  public getData(): TimeSeriesData | null {
    return this.data;
  }

  public waitForData(): Promise<void> {
    return this.dataLoadedPromise;
  }

  filterDataByDate(startDate: Moment, endDate: Moment): TimeSeriesData {
    if (!this.data) throw new Error("Data not loaded yet");
    const filteredData: TimeSeriesData = {};
    const start = moment(startDate);
    const end = moment(endDate);

    for (const [date, values] of Object.entries(this.data)) {
      const currentDate = moment(date);
      if (currentDate.isBetween(start, end, "day", "[]")) {
        filteredData[date] = values;
      }
    }

    return filteredData;
  }

  getMinMaxAreaRangeData(
    startDate: Moment,
    endDate: Moment
  ): MinMaxAreaRangeData {
    const filteredData = this.filterDataByDate(startDate, endDate);

    const result: MinMaxAreaRangeData = {
      minMaxRange: {},
      currentYearValues: [],
    };

    const currentYear = moment(endDate).year();

    for (const [date, values] of Object.entries(filteredData)) {
      const dayMonth = moment(date).format("MM-DD"); // Get MM-DD format
      const year = moment(date).year();

      const closeValue = parseFloat(values["4. close"]);

      if (year === currentYear) {
        result.currentYearValues.push({ date, value: closeValue });
      }

      if (!result.minMaxRange[dayMonth]) {
        result.minMaxRange[dayMonth] = { min: closeValue, max: closeValue };
      } else {
        result.minMaxRange[dayMonth].min = Math.min(
          result.minMaxRange[dayMonth].min,
          closeValue
        );
        result.minMaxRange[dayMonth].max = Math.max(
          result.minMaxRange[dayMonth].max,
          closeValue
        );
      }
    }

    return result;
  }

  getWeeklyAverageData(startDate: Moment, endDate: Moment): WeeklyAverage[] {
    const filteredData = this.filterDataByDate(startDate, endDate);

    const weeklyData: WeeklyData = {};
    const result: WeeklyAverage[] = [];

    for (const [date, values] of Object.entries(filteredData)) {
      const isoWeek = moment(date).isoWeek();
      const isoYear = moment(date).isoWeekYear();
      const weekKey = `${isoYear}-W${isoWeek}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, count: 0 };
      }
      weeklyData[weekKey].total += parseFloat(values["4. close"]);
      weeklyData[weekKey].count += 1;
    }

    for (const [week, stats] of Object.entries(weeklyData)) {
      result.push({ week, average: stats.total / stats.count });
    }

    return result;
  }

  getMonthlyAverageData(startDate: Moment, endDate: Moment): MonthlyAverage[] {
    const filteredData = this.filterDataByDate(startDate, endDate);

    const monthlyData: MonthlyData = {};
    const result: MonthlyAverage[] = [];

    for (const [date, values] of Object.entries(filteredData)) {
      const monthYear = moment(date).format("YYYY-MM"); // Get YYYY-MM format

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { total: 0, count: 0 };
      }
      monthlyData[monthYear].total += parseFloat(values["4. close"]);
      monthlyData[monthYear].count += 1;
    }

    for (const [month, stats] of Object.entries(monthlyData)) {
      result.push({ month, average: stats.total / stats.count });
    }

    return result;
  }
}

export default dataTransformationService.getInstance();
