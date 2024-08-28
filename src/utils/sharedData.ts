import { reactive } from "vue";
import moment, { Moment } from "moment";

export interface FilterData {
  dateRange: {
    startDate: Moment;
    endDate: Moment;
  };
  graph: string;
}

export const filterData = reactive<FilterData>({
  dateRange: {
    startDate: moment(),
    endDate: moment(),
  },
  graph: "",
});
