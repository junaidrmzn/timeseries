<template>
  <div class="date-range-picker">
    <el-date-picker
      v-model="startDate"
      type="date"
      placeholder="Select start date"
      format="YYYY-MM-DD"
      :picker-options="pickerOptions"
      @change="handleDateChange"
      class="me-3 w-40"
    ></el-date-picker>
    <el-date-picker
      v-model="endDate"
      type="date"
      placeholder="Select end date"
      format="YYYY-MM-DD"
      :picker-options="pickerOptions"
      @change="handleDateChange"
      class="w-40"
    ></el-date-picker>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from "vue";
import moment, { Moment } from "moment";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const startDate = ref<Moment>(
  props.modelValue.startDate || moment().subtract(1, "year")
);
const endDate = ref<Moment>(props.modelValue.endDate || moment());
const pickerOptions = {
  disabledDate(time: Date) {
    return moment(time).isAfter(moment(), "day");
  },
};

const handleDateChange = () => {
  emit("update:modelValue", {
    startDate: moment(startDate.value),
    endDate: moment(endDate.value),
  });
};

onMounted(() => {
  handleDateChange();
});
</script>
