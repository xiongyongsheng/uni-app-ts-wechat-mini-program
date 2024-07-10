<template>
  <div id="c-open">open-page</div>
</template>
<script lang="ts" setup>
import { onShareAppMessage, defaultShareAppConfig } from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
</script>
<style scoped></style>
