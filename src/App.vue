<template>
  <HeaderComponent />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import dataTransformationService from "./services/dataTransformationService";

onMounted(async () => {
  try {
    await dataTransformationService.loadData();
  } catch (error) {
    console.error("Failed to load stock data:", error);
  }
});
</script>
