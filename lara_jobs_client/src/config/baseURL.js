import axios from "axios";

export const baseURL = "https://totfd.in";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;