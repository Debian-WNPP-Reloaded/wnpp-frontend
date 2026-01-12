const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export class APIError extends Error {
  constructor(status: number, message: string) {
    super(message);
    console.error(status);
    this.name = "APIError";
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new APIError(
      response.status,
      `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  get: fetchAPI,
};
