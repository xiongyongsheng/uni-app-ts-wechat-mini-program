//该组件只能在page组件中使用,深层嵌套的页面中使用该组件,boundingClientRect返回值不正确.
<template>
  <div
    class="c-show-more-container"
    :style="{
      '--content-height': contentHeight + 'rpx',
    }"
    :data-check-type="checkType"
    :data-is-show-all="isShowAll"
    :data-is-show-button="isShowButton"
  >
    <slot></slot>
    <template v-if="isShowButton">
      <div
        class="c-load-more-button"
        v-if="buttonType === 'center'"
        @click="onClickMoreButton"
      >
        {{ isShowAll ? "收起" : "查看更多" }}
        <img
          class="c-load-more-button-icon"
          mode="widthFix"
          src="../../static/common/icon-right-arrow.png"
          alt=""
        />
      </div>
      <div
        v-if="buttonType === 'right'"
        id="c-show-more-container-button"
        class="c-show-more-container-button"
        @click="onClickMoreButton"
      >
        {{ isShowAll ? "收起" : "展开" }}
        <img
          class="c-show-more-container-right-arrow"
          src="../../static/common/icon-right-arrow.png"
          mode="widthFix"
          alt=""
        />
      </div>
    </template>
  </div>
</template>
<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { uniqueId } from "lodash";
const props = defineProps({
  buttonType: {
    type: String,
    default: "center",
  },
  checkType: {
    type: String,
    default: "text",
  },
  contentHeight: {
    type: Number,
    default: 300,
  },
  id: {
    required: true,
    type: String,
  },
});

const isShowAll = ref(true);
const isShowButton = ref(false);
const emit = defineEmits(["onChangeShow"]);
function onClickMoreButton() {
  isShowAll.value = !isShowAll.value;
  emit("onChangeShow", isShowAll.value);
}
onMounted(() => {
  setTimeout(() => {
    const selectorQuery = uni.createSelectorQuery();
    selectorQuery
      .select(`#${props.id}`)
      .boundingClientRect((data) => {
        if (data) {
          isShowButton.value = data.height > uni.upx2px(props.contentHeight);
          isShowAll.value = !isShowButton.value;
        } else {
          isShowButton.value = false;
          isShowAll.value = true;
        }
      })
      .exec();
  }, 1000);
});
</script>
<style scoped>
.c-show-more-container {
  position: relative;
}
.c-show-more-container[data-check-type="text"][data-is-show-all="false"] {
  overflow: hidden; /* 超出部分隐藏 */
  display: -webkit-box; /* 显示为块级元素 */
  -webkit-line-clamp: 3; /* 设置最大行数 */
  -webkit-box-orient: vertical; /* 设置为垂直方向 */
  padding-bottom: 10rpx;
}
.c-show-more-container[data-check-type="text"][data-is-show-all="true"] {
  overflow: initial;
  -webkit-line-clamp: initial;
}
.c-show-more-container[data-is-show-button="true"][data-is-show-all="true"] {
  padding-bottom: 50rpx;
}
.c-show-more-container[data-check-type="height"][data-is-show-all="false"] {
  overflow: hidden;
  height: var(--content-height);
}
.c-show-more-container::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
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

.c-show-more-container-button {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #f4f4f4;
  color: var(--gray-color);
  font-size: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10rpx;
  padding: 5rpx 15rpx;
}

.c-show-more-container-right-arrow {
  width: 10rpx;
  height: auto;
}
</style>
