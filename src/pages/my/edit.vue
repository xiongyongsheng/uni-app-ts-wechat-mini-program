<template>
  <div class="c-page">
    <form @submit="onSubmit">
      <div class="c-cell-row">
        <span>头像</span>
        <button open-type="chooseAvatar" @chooseavatar="chooseAvatar">
          <img
            class="c-default-avatar"
            mode="widthFix"
            :src="formData.avatar || user.defaultAvatar"
            alt=""
          />
        </button>
      </div>
      <div class="c-line"></div>
      <div class="c-cell-row">
        <span>昵称</span>
        <input
          @change="onChange"
          :value="formData.nickName"
          placeholder="请输入昵称"
          type="nickname"
        />
      </div>
      <div class="c-line"></div>
      <div class="c-cell-desc">昵称限2-32个字符，一个汉字为2个字符</div>
      <button
        class="c-theme-button"
        hover-class="c-theme-button-hover"
        form-type="submit"
        @click="submit"
      >
        确定
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import { onShareAppMessage, defaultShareAppConfig } from "@/utils/share";
onShareAppMessage(() => {
  return defaultShareAppConfig;
});
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
const user = useUserStore();
onLoad(() => {
  formData.value = {
    nickName: user.data.wechatUserInfo.nickname,
    avatar: user.data.wechatUserInfo.avatar,
  };
});

const formData = ref({
  nickName: "",
  avatar: "",
});
function chooseAvatar(info) {
  formData.value.avatar = info.detail.avatarUrl;
}
function onSubmit() {
  if (
    formData.value.avatar !== user.data.wechatUserInfo.avatar ||
    formData.value.nickName !== user.data.wechatUserInfo.nickname
  ) {
    if (formData.value.avatar === user.data.wechatUserInfo.avatar) {
      update();
    } else {
      uni.showLoading({
        title: "上传中..",
        mask: true,
      });
      const failCallback = () => {
        uni.hideLoading();
        uni.showToast({
          title: "上传头像失败",
          icon: "error",
        });
      };
      uni.uploadFile({
        url: import.meta.env.VITE_API_URL + "/api/wxmp/upload",
        filePath: formData.value.avatar,
        name: "file",
        header: {
          Authorization: "SaBearer " + user.data.token,
          ContentType: "application/x-www-form-urlencoded",
          skipToken: true,
        },
        success: (res) => {
          if (res.statusCode == 200) {
            let data = JSON.parse(res.data);
            formData.value.avatar = data.data.link;
            uni.hideLoading();
            update();
          } else {
            failCallback();
          }
        },
        fail(result) {
          failCallback();
        },
      });
    }
  } else {
    uni.navigateBack();
  }
}
function onChange(e) {
  formData.value.nickName = e.detail.value;
}
function update() {
  // uni.showLoading({
  //   title: "加载中..",
  //   mask: true,
  // });
  // userUpdate(formData.value)
  //   .then((res) => {
  //     uni.showToast({
  //       title: "修改成功!",
  //       icon: "success",
  //     });
  //     uni.navigateBack();
  //   })
  //   .finally(() => {
  //     uni.hideLoading();
  //   });
}
</script>
<style scoped lang="scss">
.c-page form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 30rpx;
}
.c-cell-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 96rpx;
  padding: 0 10rpx;
}
.c-cell-row label {
  color: #666666;
  font-size: 24rpx;
}
.c-cell-row button {
  all: unset;
  width: 75rpx;
  height: 75rpx;
  border-radius: 50%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.c-cell-row input {
  flex: 0 0 500rpx;
  text-align: right;
}
.c-default-avatar {
  width: 100%;
  height: 100%;
}
.c-line {
  margin: 0;
}
.c-cell-desc {
  font-size: 20rpx;
  color: var(--gray-color);
  margin-top: 20rpx;
}
.c-theme-button {
  height: 90rpx;
  margin-top: 90rpx;
  font-size: border;
  font-size: 35rpx;
}
</style>
