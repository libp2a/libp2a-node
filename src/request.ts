import { BASE_URL } from "./config";

class RequestError extends Error {
  constructor(status: number, message: string) {
    super(`HTTP ${status}: ${message}`);
  }
}

export async function request<T>(path: string, options = {}): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);

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