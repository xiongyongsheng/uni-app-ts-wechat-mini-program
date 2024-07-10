<template>
  <div class="c-navigation-bar">
    <div
      :style="{
        height: statusBarHeight,
      }"
    ></div>
    <div class="c-navigation-bar-wrapper" style="height: 44px">
      <div class="c-navigation-bar-button" @click="handleBack">
        <img
          v-if="isShowBackButton"
          class="c-to-back-icon"
          mode="widthFix"
          src="../../static/common/icon-left-arrow.png"
          alt=""
        />
        <img
          v-else
          class="c-to-home-icon"
          mode="widthFix"
          src="../../static/common/SolarHome2Bold.png"
          alt=""
        />
      </div>
      <div class="c-navigation-bar-title c-line-1">{{ title }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
const props = defineProps({
  title: String,
  homeUrl: {
    type: String,
    default: "/pages/index/index",
  },
});
const windowInfo = uni.getWindowInfo();
const statusBarHeight = windowInfo.statusBarHeight + "px";

const currentPages = getCurrentPages();
const isShowBackButton = computed(() => {
  return currentPages.length > 1;
});
function handleBack() {
  if (isShowBackButton.value) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: props.homeUrl,
    });
  }
}
</script>
<style scoped>
.c-navigation-bar-wrapper {
  --icon-size: 50rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.c-navigation-bar-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #000;
  flex: 1;
  text-align: center;
  margin: 0 var(--icon-size) 0 0;
}
.c-to-home-icon {
  width: 100%;
  height: auto;
}
.c-navigation-bar-button {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.7;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
  padding: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c-to-back-icon {
  width: 20rpx;
}
</style>
