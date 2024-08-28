<template>
  <el-header height="80px" class="header conatainer">
    <DateRangePicker v-model:modelValue="dateRange" />
    <el-select
      v-model="value"
      filterable
      placeholder="Select"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import DateRangePicker from "./DateRangePickerComponent.vue";
import { filterData } from "@/utils/sharedData";
import moment from "moment";
import { DateRange } from "@/types/app";

const dateRange = ref<DateRange>({
  startDate: moment().subtract(1, "year").format("YYYY-MM-DD"),
  endDate: moment().format("YYYY-MM-DD"),
});
const value = ref("monthlyData");
const options = [
  {
    value: "monthlyData",
    label: "Monthly Average Data",
  },
  {
    value: "weeklyData",
    label: "Weekly Average Data",
  },
  {
    value: "minMaxData",
    label: "Min-Max Area Range Data",
  },
];

watch([dateRange, value], () => {
  filterData.dateRange = dateRange.value;
  filterData.graph = value.value;
});
</script>
