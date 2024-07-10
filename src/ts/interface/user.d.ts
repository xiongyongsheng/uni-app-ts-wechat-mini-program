declare namespace CUser {
  interface info {
    token: string | null;
    openId: string | null;
    phoneNumber: string | number | null;
    wechatUserInfo: {
      avatarUrl: string | undefined;
      city: string | null;
      country: string | null;
      gender: number | null;
      language: string | null;
      nickname: string | null;
      province: string | null;
    };
    isNewRegister: boolean;
  }
}
