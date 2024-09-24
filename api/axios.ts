import axios from "axios";
// import { BASE_URL } from "@env";

// const BASE_URL = "http://localhost:8080/api";
const BASE_URL =
  "https://fc17-2405-4802-bcbf-e020-9f5-9955-b595-9a8.ngrok-free.app/api";
const ONE_MINUTE = 60000;

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const request = axios.create({
  baseURL: BASE_URL,
  timeout: ONE_MINUTE,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export { request };
