import axios from "axios";

export const baseURL = "http://localhost:3008";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;