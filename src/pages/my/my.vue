<template>
  <dvi class="c-my c-grid-container c-custom-tab-bar-safe-area"> </dvi>
</template>

<script setup lang="ts">
import { onShareAppMessage, defaultShareAppConfig } from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
</script>

<style scoped></style>
