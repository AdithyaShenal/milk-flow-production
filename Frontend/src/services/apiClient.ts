import axios from "axios";

// const BASE_URL = "/api";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
