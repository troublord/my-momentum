import { useAuth } from "../contexts/AuthContext";

const API_BASE = "http://localhost:8080";

export const useApi = () => {
  const { accessToken } = useAuth();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  return {
    get: async <T>(endpoint: string): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, { headers });
        if (res.status === 401) {
          localStorage.removeItem("mm_access_token");
          window.location.href = "/";
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
      }
    },

    post: async <T>(endpoint: string, data?: any): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        if (res.status === 401) {
          localStorage.removeItem("mm_access_token");
          window.location.href = "/";
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
      }
    },

    put: async <T>(endpoint: string, data?: any): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "PUT",
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        if (res.status === 401) {
          localStorage.removeItem("mm_access_token");
          window.location.href = "/";
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`PUT ${endpoint} failed:`, error);
        throw error;
      }
    },

    delete: async <T>(endpoint: string): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "DELETE",
          headers,
        });
        if (res.status === 401) {
          localStorage.removeItem("mm_access_token");
          window.location.href = "/";
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        // DELETE 可能回傳空內容
        if (res.status === 204) return null;
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`DELETE ${endpoint} failed:`, error);
        throw error;
      }
    },
  };
};
