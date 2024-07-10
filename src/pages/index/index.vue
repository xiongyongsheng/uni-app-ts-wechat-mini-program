<template>
  <div class="c-page-container c-border-box c-custom-tab-bar-safe-area"></div>
</template>

<script setup lang="ts">
import {
  onShareAppMessage,
  defaultShareAppConfig,
  onShareTimeline,
  defaultShareTimelineConfig,
} from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
onShareTimeline(() => {
  return defaultShareTimelineConfig;
});
</script>

<style scoped>
.c-page-container {
  padding: 0 0 0;
}
</style>
