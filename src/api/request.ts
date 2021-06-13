import request from "./config";
import type { ILoginParams } from "./types";

export const getCaptch = () => {
  return request({ method: "get", url: "/captcha" });
};

export const login = ({ username, password, captcha }: ILoginParams) => {
  return request({
    method: "post",
    url: "/login",
    data: {
      username,
      password,
      captcha,
    },
  });
};

export const register = ({ username, password, captcha }: ILoginParams) => {
  return request({
    method: "post",
    url: "/register",
    data: {
      username,
      password,
      captcha,
    },
  });
};
