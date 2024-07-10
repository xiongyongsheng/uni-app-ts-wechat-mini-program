<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import { useSystemInfoStore } from "@/stores/system-info";
const user = useUserStore();
const systemInfo = useSystemInfoStore();
onLaunch(() => {
  console.log("App Launch");
  uni.checkSession({
    success(result) {},
    fail(result) {
      user.login();
    },
  });
});
onShow((params) => {
  console.log("App Show", params);
  systemInfo.onShowParams = params;
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@import "./style/common.css";
</style>
