<template>
  <div class="c-custom-tab-bar-safe-area"></div>
</template>

<script setup lang="ts">
import { onShareAppMessage, defaultShareAppConfig } from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
</script>

<style scoped></style>
