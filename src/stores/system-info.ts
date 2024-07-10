import { onShow } from "@dcloudio/uni-app";
import { defineStore } from "pinia";
import { computed, reactive, watch, ref } from "vue";
import type { Ref } from "vue";

export const useSystemInfoStore = defineStore("system", () => {
  const systemInfo = ref(uni.getSystemInfoSync());
  const onShowParams: Ref<App.LaunchShowOption | undefined> = ref(undefined);
  return {
    systemInfo,
    onShowParams,
  };
});
