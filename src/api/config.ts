import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

interface RequestParams {
  method: "get" | "post";
  url: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
}

function request(params: RequestParams) {
  const { method, url, ...rest } = params;
  return axiosInstance({
    method,
    url,
    ...rest,
  })
    .then((data) => {
      const response = data.data;
      if (response.code === 200) {
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((err) => {
      return Promise.reject(err.message);
    });
}

export default request;
