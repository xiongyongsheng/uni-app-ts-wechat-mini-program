import { defineStore } from "pinia";
// import _ from "lodash";
import { computed, reactive, watch, ref } from "vue";
import { sessionInfo, userInfo, register, login } from "@/api/interface/user";
// import { userDetail } from "@/api/interface/my";

class User {
  token = null;
  openId = null;
  phoneNumber = null;
  // 微信userInfo
  wechatUserInfo = {
    avatarUrl: null,
    city: null,
    country: null,
    gender: null,
    language: null,
    nickname: null,
    province: null,
  };
  // 是否是新用户
  isNewRegister = true;
  constructor(isNewRegister: boolean = true) {
    this.isNewRegister = isNewRegister;
  }
}

let storageData: CUser.info;
try {
  storageData = JSON.parse(
    uni.getStorageSync(import.meta.env.VITE_STORAGE_KEY)
  ) as CUser.info;
} catch (e) {
  console.log("getStorage Error: ", e);
}
// MOCK用户
// storageData = {"token":"18c7e347-7da1-41e4-8003-449bd64ef371","openId":"oNJMG7Xy9ppEjbxIl1C00TOh4jVs","phoneNumber":null,"wechatUserInfo":{"nickname":"微信用户","gender":0,"language":"","city":"","province":"","country":"","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"},"isNewRegister":false};
export const useUserStore = defineStore("user", () => {
  const data: CUser.info = reactive(storageData || new User());
  const isShowAuthModal = ref(false);
  const isLogin = computed(() => {
    return Boolean(data.token);
  });
  const defaultAvatar = ref("");
  watch(
    [data],
    ([{ token }], [{ token: oldToken }]) => {
      if (!token && oldToken) {
        //退出登录
      } else if (token && !oldToken) {
        //登录
        isShowAuthModal.value = false;
      } else if (token && oldToken) {
        //切换用户 or 刷新token
        isShowAuthModal.value = false;
      }

      saveStorage();
    },
    { deep: true }
  );
  function login() {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
    return new Promise((resolve, reject) => {
      uni.login({
        success: ({ code }) => {
          sessionInfo({
            code,
          })
            .then((res) => {
              if (res.data) {
                data.openId = res.data.openId as string;
                data.token = res.data.token as string;
                getUserDetail();
              }
              resolve(res);
            })
            .catch(() => {
              reject();
            })
            .finally(() => {
              uni.hideLoading();
            });
        },
        fail: (error) => {
          reject();
          uni.hideLoading();
        },
      });
    });
  }
  function getUserDetail() {
    // return userDetail().then((res) => {
    //   // @ts-ignore
    //   data.wechatUserInfo = res.data;
    //   data.phoneNumber = res.data.phone;
    // });
  }
  function getUserInfo(info: {
    detail: {
      encryptedData: string;
      iv: string;
      userInfo: CUser.info["wechatUserInfo"];
    };
  }) {
    uni.vibrateShort();
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
    uni.getUserProfile({
      desc: "获取用户信息描述",
      success: (profile) => {
        console.log("profile: ", profile);
        userInfo({
          openId: data.openId as string,
          encryptKey: profile.encryptedData,
          iv: profile.iv,
        })
          .then((res) => {
            data.isNewRegister = res.data.isNewRegister as boolean;
          })
          .finally(() => {
            uni.hideLoading();
          });
      },
      fail: (error) => {
        console.error("error: ", error);
      },
    });
  }
  function getPhoneNumber(phone: { detail: { encryptedData: any; iv: any } }) {
    uni.vibrateShort();
    console.log("getPhoneNumber: ", phone);
    if (phone.detail.encryptedData && phone.detail.iv) {
      uni.showLoading({
        title: "加载中...",
        mask: true,
      });
      register({
        openId: data.openId as string,
        phoneEncryptKey: phone.detail.encryptedData,
        phoneIv: phone.detail.iv,
      })
        .then((res) => {
          getUserDetail();
        })
        .finally(() => {
          uni.hideLoading();
        });
    }
  }
  function logout(message: string) {
    data.token = null;
    data.openId = null;
    data.phoneNumber = null;
    uni.showToast({
      title: message || "已退出",
      icon: "none",
      duration: 3000,
    });
    login();
  }
  function saveStorage() {
    console.log("data: ", data);
    try {
      uni.setStorageSync(
        import.meta.env.VITE_STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (e) {
      console.error("saveStorage Error: ", e);
    }
  }
  function checkLogin() {
    console.log(isLogin.value);
    if (isLogin.value) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }
  function checkPhoneNumber() {
    if (data.phoneNumber) {
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }
  return {
    data,
    isLogin,
    isShowAuthModal,
    defaultAvatar,
    getUserDetail,
    login,
    logout,
    getUserInfo,
    getPhoneNumber,
    checkLogin,
    checkPhoneNumber,
  };
});
