import axios from "axios";
import { HOST } from "./config";

export const httpClient = axios.create({
  baseURL: HOST,
  headers: {
    "Content-Type": "application/json",
  },
});