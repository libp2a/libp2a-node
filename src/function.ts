import { request } from "./request";

// RESULT

type Result<T = any> = {
  value: T;
  run?: Run;
};

type Run = {
  id: number;
  transportName: string;
  events: RunEvent[];
};

type RunEvent = {
  id: number;
  name: string;
  data: Record<string, any>;
};

export function translateResponseIntoResult<T>(data: Record<string, any>) : Result<T> {
  const run = data.run ? {
    id: data.run.id,
    transportName: data.run.transport_name,
    events: data.run.events,
  } : undefined;

  return {
    value: data.value,
    run,
  }
}

// OPTIONS

type Options = {
  withRunEvents?: boolean;
}

export function translateOptionsIntoParams(options: Options) {
  return {
    with_run_events: options.withRunEvents,
  }
}

// CALL

export async function call<T=any>(prompt: string, options: Options = {}): Promise<Result<T>> {
  const data = await request<any>("/api/v1/function/call", {
    method: "POST",
    params: { prompt, ...translateOptionsIntoParams(options) },
  });
  
  return translateResponseIntoResult<T>(data);
}

// CHAT

export async function chat<T=any>(prompt: string, options: Options = {}): Promise<Result<T>> {
  const data = await request<any>("/api/v1/function/chat", {
    method: "POST",
    params: { prompt, ...translateOptionsIntoParams(options) },
  });

  return translateResponseIntoResult<T>(data);
}
