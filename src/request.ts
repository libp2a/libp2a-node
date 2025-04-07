import { BASE_URL } from "./config";

class RequestError extends Error {
  constructor(status: number, message: string) {
    super(`${status}: ${message}`);
  }
}

type RequestOptions = {
  method: "GET" | "POST";
  params?: Record<string, any>;
}

export async function request<T>(path: string, options: RequestOptions): Promise<T> {
  try {
    const method = options.method;
    const body = options.params ? JSON.stringify(options.params) : undefined;
    const headers = {
      "User-Agent": "@libp2a/libp2a-node",
      "Content-Type": "application/json"
    }

    const response = await fetch(`${BASE_URL}${path}`, { method, body, headers });

    if (!response.ok) {
      try {
        const rawError = await response.text();

        throw new RequestError(response.status, rawError);
      } catch (err) {
        if (err instanceof Error) {
          throw new RequestError(response.status, err.message);
        }

        throw new RequestError(response.status, response.statusText);
      }
    }

    return await response.json() as unknown as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new RequestError(500, error.message);
    }

    throw new RequestError(500, 'Unknown error');
  }
}