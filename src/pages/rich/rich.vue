<template>
  <div class="c-page c-grid-container">
    <view class="c-grid-item-full">
      <mp-html :content="richContent" @ready="onMpHtmlReady"></mp-html>
    </view>
  </div>
</template>
<script setup lang="ts">
import { onShareAppMessage, defaultShareAppConfig } from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
import { ref } from "vue";
// @ts-ignore
import MpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";

const richContent = ref(null);
const isReady = ref(false);
function onMpHtmlReady() {
  isReady.value = true;
}
</script>
<style scoped>
.c-page {
  padding: 0;
}

.c-title {
  font-size: 32rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.c-rich-image {
  width: 750rpx;
  height: auto;
}
</style>
