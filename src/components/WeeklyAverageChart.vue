<template>
  <div ref="chart" class="bar-chart"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps, onUnmounted } from "vue";
import { WeeklyAverage } from "@/types/app";
import * as d3 from "d3";

const props = defineProps<{
  data: WeeklyAverage[];
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
    .domain(props.data.map((d: WeeklyAverage) => d.week))
    .range([0, width])
    .padding(0.1);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", () => {
      if (props.data.length > 20) {
        return "8px";
      }
      return "10px";
    })
    .call(
      d3
        .axisBottom(x)
        .tickFormat((d) => d.toString())
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
    .domain([0, d3.max(props.data, (d: WeeklyAverage) => d.average)!])
    .nice()
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

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

  // Bars
  svg
    .selectAll(".bar")
    .data(props.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d: WeeklyAverage) => x(d.week)!)
    .attr("y", (d: WeeklyAverage) => y(d.average))
    .attr("width", x.bandwidth())
    .attr("height", (d: WeeklyAverage) => height - y(d.average))
    .attr("fill", "#5c73e7")
    .attr("rx", 5)
    .attr("ry", 5)
    .style("opacity", 0.7)
    .on("mouseover", function (event: MouseEvent, d: WeeklyAverage) {
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
        .text(`Week: ${d.week} - Average: ${d.average.toFixed(2)}`)
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
    .attr("x", (d: WeeklyAverage) => x(d.week)! + x.bandwidth() / 2)
    .attr("y", (d: WeeklyAverage) => y(d.average) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#e5e5e5")
    .style("font-size", "10px")
    .text((d: WeeklyAverage) => d.average.toFixed(2))
    .style("display", () => {
      if (props.data.length > 20) {
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
.bar-chart {
  width: 100%;
  height: 100%;
}

.bar {
  fill: rgb(216, 227, 236);
}
</style>
