import ApiRequest from "../http-request/api.request";

const apiRequest = new ApiRequest();

export const sessionInfo = (data: { code: string }) => {
  return apiRequest.create({
    url: "/api/wxmp/micro/sessionInfo",
    data,
    method: "GET",
  });
};

export const userInfo = (data: {
  openId: string;
  encryptKey: string;
  iv: string;
}) => {
  return apiRequest.create({
    url: "/api/wxmp/micro/userInfo",
    data,
    method: "POST",
  });
};

export const register = (data: {
  openId: string;
  phoneEncryptKey: string;
  phoneIv: string;
}) => {
  return apiRequest.create({
    url: "/api/wxmp/micro/register",
    data,
    method: "POST",
  });
};

export const login = (data: { openId: string }) => {
  return apiRequest.create({
    url: "/api/wxmp/micro/login",
    data,
    method: "POST",
  });
};
