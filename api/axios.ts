import axios, { AxiosResponse } from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? // ? "http://192.168.1.110:8080/api"
      "http://10.10.78.47:8080/api"
    : "http://localhost:8080/api";
const ONE_MINUTE = 60000;

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const request = axios.create({
  baseURL: BASE_URL,
  timeout: ONE_MINUTE,
  headers: {
    "Content-Type": "application/json",
  },
});

export { request };
