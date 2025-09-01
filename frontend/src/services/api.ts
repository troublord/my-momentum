import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";

const API_BASE = "http://localhost:8080";

export const useApi = () => {
  const { accessToken } = useAuth();
  const { addError } = useError();

  const headers: HeadersInit = useMemo(() => ({
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }), [accessToken]);

  const handleApiError = useCallback((error: any, endpoint: string, method: string) => {
    let errorMessage = "發生未知錯誤";
    let errorTitle = "API 錯誤";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Don't show error for authentication failures as they redirect
    if (error?.message?.includes('401') || error?.status === 401) {
      return;
    }

    addError({
      type: 'error',
      title: errorTitle,
      message: `${method} ${endpoint} 失敗: ${errorMessage}`,
      autoHide: true,
      autoHideDelay: 5000,
    });
  }, [addError]);

  const get = useCallback(async <T>(endpoint: string): Promise<T | null> => {
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
        handleApiError(error, endpoint, 'GET');
        throw error;
      }
  }, [headers, handleApiError]);

  const post = useCallback(async <T>(endpoint: string, data?: any): Promise<T | null> => {
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
        handleApiError(error, endpoint, 'POST');
        throw error;
      }
  }, [headers, handleApiError]);

  const put = useCallback(async <T>(endpoint: string, data?: any): Promise<T | null> => {
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
        handleApiError(error, endpoint, 'PUT');
        throw error;
      }
  }, [headers, handleApiError]);

  const deleteMethod = useCallback(async <T>(endpoint: string): Promise<T | null> => {
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
        handleApiError(error, endpoint, 'DELETE');
        throw error;
      }
  }, [headers, handleApiError]);

  return {
    get,
    post,
    put,
    delete: deleteMethod,
  };
};
