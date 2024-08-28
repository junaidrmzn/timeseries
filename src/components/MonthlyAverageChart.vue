<template>
  <div ref="chart" class="scatter-plot"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps, onUnmounted } from "vue";
import { MonthlyAverage } from "@/types/app";
import * as d3 from "d3";

const props = defineProps<{
  data: MonthlyAverage[];
}>();

const chart = ref<HTMLElement | null>(null);

// Function to draw the chart
const drawChart = () => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const containerWidth = chart.value?.clientWidth || 800;
  const containerHeight = chart.value?.clientHeight || 400;
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  const svg = d3
    .select(chart.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(props.data.map((d: MonthlyAverage) => d.month))
    .range([0, width])
    .padding(0.1);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", () => {
      if (props.data.length > 20) {
        return "10px";
      }
      return "12px";
    })
    .call(
      d3
        .axisBottom(x)
        .tickFormat((d: string) => d)
        .tickSize(0)
    );

  // Rotate the x-axis labels
  xAxis
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-45)")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .style("display", (d, i: number) => {
      if (props.data.length > 20) {
        return i % 5 === 0 ? "block" : "none";
      }
      return "block";
    });

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d: MonthlyAverage) => d.average)!])
    .nice()
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  // Add grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(null))
    .selectAll(".tick line")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "1px")
    .attr("opacity", 0.7);

  // Add vertical line for baseline (e.g., x = 0 for reference)
  svg
    .append("line")
    .attr("class", "baseline")
    .attr("x1", x(props.data[0].month)!) // Example to draw at the first x position
    .attr("x2", x(props.data[props.data.length - 1].month)!)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("stroke", "#ccc")
    .attr("stroke-width", "2px")
    .attr("stroke-dasharray", "4,4"); // Dashed line style

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

  // Scatter points
  svg
    .selectAll(".dot")
    .data(props.data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d: MonthlyAverage) => x(d.month)!)
    .attr("cy", (d: MonthlyAverage) => y(d.average))
    .attr("r", 5)
    .attr("fill", "#5c73e7")
    .style("opacity", 0.7)
    .on("mouseover", function (event: MouseEvent, d: MonthlyAverage) {
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("cursor", "pointer");

      tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("font-size", "10px")
        .text(`Month: ${d.month} - Average: ${d.average.toFixed(2)}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mousemove", function (event: MouseEvent) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).style("opacity", 0.7);

      tooltip.transition().duration(200).style("opacity", 0);
    });

  svg
    .selectAll(".label")
    .data(props.data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d: MonthlyAverage) => x(d.month)! + 5)
    .attr("y", (d: MonthlyAverage) => y(d.average) - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "#e5e5e5")
    .style("font-size", "10px")
    .text((d: MonthlyAverage) => d.average.toFixed(2))
    .style("display", () => {
      if (props.data.length > 50) {
        return "none";
      }
      return "block";
    });
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
.scatter-plot {
  width: 100%;
  height: 100%;
}
</style>
