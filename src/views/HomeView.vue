<template>
  <el-container v-if="isLoaded" class="home-page d-flex">
    <div
      class="chart-container"
      v-if="filterData.graph === 'minMaxData' && minMaxAreaRangeData"
    >
      <MinMaxAreaChart :data="minMaxAreaRangeData" />
    </div>
    <div
      class="chart-container"
      v-if="filterData.graph === 'weeklyData' && weeklyAverage"
    >
      <WeeklyAverageChart :data="weeklyAverage" />
    </div>
    <div
      class="chart-container"
      v-if="filterData.graph === 'monthlyData' && monthlyAverage"
    >
      <MonthlyAverageChart :data="monthlyAverage" />
    </div>
    <div
      class="d-flex justify-content-center align-items-center h-100 w-100"
      v-else
    >
      Thank you for using Alpha Vantage! Our standard API rate limit is 25
      requests per day. limits.
    </div>
  </el-container>

  <div v-else class="d-flex justify-content-center align-items-center h-100">
    Loading data...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { TimeSeriesData } from "@/types/api";
import dataTransformationService from "@/services/dataTransformationService";
import MinMaxAreaChart from "@/components/MinMaxAreaChart.vue";
import WeeklyAverageChart from "@/components/WeeklyAverageChart.vue";
import MonthlyAverageChart from "@/components/MonthlyAverageChart.vue";
import { FilterData, filterData } from "@/utils/sharedData";
import {
  DateRange,
  MinMaxAreaRangeData,
  WeeklyAverage,
  MonthlyAverage,
} from "@/types/app";

const data = ref<TimeSeriesData | null>(null);
const isLoaded = ref<boolean>(false);
const minMaxAreaRangeData = ref<MinMaxAreaRangeData | null>(null);
const weeklyAverage = ref<WeeklyAverage[] | null>(null);
const monthlyAverage = ref<MonthlyAverage[] | null>(null);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  try {
    await dataTransformationService.waitForData();
    data.value = dataTransformationService.getData();
    filterData.graph = "monthlyData";
    fetchMonthlyData(filterData.dateRange);
    isLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const fetchMinMaxData = async ({ startDate, endDate }: DateRange) => {
  if (data.value) {
    minMaxAreaRangeData.value = null;
    try {
      minMaxAreaRangeData.value =
        await dataTransformationService.getMinMaxAreaRangeData(
          startDate,
          endDate
        );
    } catch (error) {
      console.error("Error fetching MinMax data:", error);
    }
  }
};

const fetchWeeklyData = async ({ startDate, endDate }: DateRange) => {
  if (data.value) {
    try {
      weeklyAverage.value =
        await dataTransformationService.getWeeklyAverageData(
          startDate,
          endDate
        );
    } catch (error) {
      console.error("Error fetching Weekly data:", error);
    }
  }
};

const fetchMonthlyData = async ({ startDate, endDate }: DateRange) => {
  if (data.value) {
    try {
      monthlyAverage.value =
        await dataTransformationService.getMonthlyAverageData(
          startDate,
          endDate
        );
    } catch (error) {
      console.error("Error fetching Monthly data:", error);
    }
  }
};

watch(
  () => filterData,
  ({ dateRange, graph }: FilterData) => {
    switch (graph) {
      case "minMaxData":
        fetchMinMaxData(dateRange);
        break;
      case "weeklyData":
        fetchWeeklyData(dateRange);
        break;
      case "monthlyData":
        fetchMonthlyData(dateRange);
        break;
      default:
        console.error("Unknown Data Type");
        break;
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  flex-grow: 1;
}
</style>
