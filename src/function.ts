import { httpClient } from "./http-client";

type Result = {
  value: any;
  run: Run;
};

type Run = {
  id: number;
  transport_name: string;
  events: RunEvent[];
};

type RunEvent = {
  id: number;
  name: string;
  data: Record<string, any>;
};

export async function call(prompt: string): Promise<Result> {
  const { data } = await httpClient.post("/api/v1/function/call", { prompt });

  return data;
}

export async function chat(prompt: string): Promise<Result> {
  const { data } = await httpClient.post("/api/v1/function/chat", { prompt });

  return data;
}
