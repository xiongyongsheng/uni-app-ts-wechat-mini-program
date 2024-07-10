<template>
  <div
    class="c-load-more-container"
    :style="{
      height: isShowAll ? 'auto' : height,
    }"
  >
    <slot></slot>
    <div
      class="c-load-more-button"
      v-if="isShowButton"
      @click="onClickMoreButton"
    >
      {{ isShowAll ? "收起" : "查看更多" }}
      <img
        class="c-load-more-button-icon"
        mode="widthFix"
        src="https://ys-micro.oss-cn-shanghai.aliyuncs.com/ys-micro/file/static/%E5%90%88%E5%B9%B6%E5%BD%A2%E7%8A%B6.png"
        alt=""
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";
const props = defineProps({
  isShowButton: Boolean,
  height: {
    type: String,
    default: "700rpx",
  },
});
watch(
  () => [props.isShowButton],
  () => {
    if (props.isShowButton) {
    } else {
      isShowAll.value = true;
    }
  },
  { deep: true }
);
const isShowAll = ref(false);
const emit = defineEmits(["onChangeShow"]);
function onClickMoreButton() {
  isShowAll.value = !isShowAll.value;
  emit("onChangeShow", isShowAll.value);
}
</script>
<style scoped>
.c-load-more-container {
  position: relative;
  overflow: hidden;
}
.c-load-more-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50rpx;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 1)
  );
  color: #666;
  font-weight: 300;
  font-size: 25rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
}
.c-load-more-button-icon {
  width: 12rpx;
  height: auto;
}
</style>
