<template>
  <div ref="chart" class="min-max-area-chart"></div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import moment from "moment";
import { onMounted, onUnmounted, ref, watch, defineProps } from "vue";
import { MinMaxAreaRangeData } from "@/types/app";

const props = defineProps<{
  data: MinMaxAreaRangeData;
}>();

const chart = ref<HTMLElement | null>(null);

const drawChart = () => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const containerWidth = chart.value?.clientWidth || 800;
  const containerHeight = chart.value?.clientHeight || 400;
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  const svg = d3
    .select(chart.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Convert the minMaxRange data to an array of objects
  const minMaxArray = Object.keys(props.data.minMaxRange).map((key) => ({
    date: moment(`2024-${key}`, "YYYY-MM-DD").toDate(),
    min: props.data.minMaxRange[key].min,
    max: props.data.minMaxRange[key].max,
  }));

  // Parse the dates for the currentYearValues
  const currentYearArray = props.data.currentYearValues.map((d) => ({
    date: moment(d.date, "YYYY-MM-DD").toDate(),
    value: d.value,
  }));

  const x = d3
    .scaleTime()
    .domain(d3.extent(currentYearArray, (d) => d.date) as [Date, Date])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(minMaxArray, (d) => d.min) as number,
      d3.max(minMaxArray, (d) => d.max) as number,
    ])
    .nice()
    .range([height, 0]);

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(null));

  // Y-axis
  svg.append("g").call(d3.axisLeft(y));

  // Min-Max Area
  svg
    .append("path")
    .datum(minMaxArray)
    .attr("fill", "#cce5df")
    .attr("stroke", "none")
    .style("opacity", 0.7)
    .attr(
      "d",
      d3
        .area<any>()
        .x((d) => x(d.date))
        .y0((d) => y(d.min))
        .y1((d) => y(d.max))
    );

  // Current Year Line
  svg
    .append("path")
    .datum(currentYearArray)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line<any>()
        .x((d) => x(d.date))
        .y((d) => y(d.value))
    );

  // Add dots for current year data points
  svg
    .selectAll("dot")
    .data(currentYearArray)
    .enter()
    .append("circle")
    .attr("cx", (d: any) => x(d.date))
    .attr("cy", (d) => y(d.value))
    .attr("r", 3)
    .attr("fill", "#1f77b4")
    .on("mouseover", function (event, d: any) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Date: ${moment(d.date).format("YYYY-MM-DD")}<br>Value: ${d.value}`
        )
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Create tooltip element
  const tooltip = d3
    .select(chart.value)
    .append("div")
    .style("position", "absolute")
    .style("background-color", "#1b1b1f")
    .style("border", "1px solid #3c3f44")
    .style("padding", "5px")
    .style("border-radius", "3px")
    .style("pointer-events", "none")
    .style("opacity", 0);
};

// Function to update the chart
const updateChart = () => {
  d3.select(chart.value).selectAll("*").remove();
  drawChart();
};

onMounted(() => {
  drawChart();
  window.addEventListener("resize", updateChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateChart);
});

watch(
  () => props.data,
  () => {
    updateChart();
  }
);
</script>

<style scoped>
.min-max-area-chart {
  width: 100%;
  height: 100%;
}

.dot {
  fill: #1f77b4;
}
</style>
