/**
 * API utility functions for making authenticated requests
 * Uses httpOnly cookies for authentication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Makes an authenticated API request
 * Automatically includes credentials (cookies) with every request
 */
export async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const defaultOptions: FetchOptions = {
    credentials: "include", // Always include cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  return response;
}

/**
 * GET request with authentication
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * POST request with authentication
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * PUT request with authentication
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown,
): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * DELETE request with authentication
 */
export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Logout user by clearing cookies
 */
export async function logout(): Promise<void> {
  try {
    await apiPost("/api/auth/logout");
    // Clear any local user data
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the request fails, clear local data
    localStorage.removeItem("user");
  }
}
