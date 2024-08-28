import axios from "axios";
import type { TimeSeriesData } from "../types/api";

const API_KEY = "123";
const BASE_URL = "https://www.alphavantage.co/query";

export const fetchData = async (symbol = "AAPL"): Promise<TimeSeriesData> => {
  const response = await axios.get(BASE_URL, {
    params: {
      function: "TIME_SERIES_DAILY",
      symbol: symbol,
      outputsize: "full",
      apikey: API_KEY,
    },
  });
  return response.data["Time Series (Daily)"];
};
