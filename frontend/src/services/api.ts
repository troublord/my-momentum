import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";

const API_BASE = "http://localhost:8080";

export const useApi = () => {
  const { accessToken, logout } = useAuth();
  const { addError } = useError();

  const headers: HeadersInit = useMemo(() => {
    const headersObj = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    console.log("🔧 Headers updated:", {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length || 0,
      headers: headersObj,
    });
    return headersObj;
  }, [accessToken]);

  const handleAuthError = useCallback(() => {
    logout();
    addError({
      type: "error",
      title: "登入已過期",
      message: "您的登入已過期，請重新登入",
      autoHide: true,
      autoHideDelay: 5000,
    });
  }, [logout, addError]);

  const handleApiError = useCallback(
    (error: any, endpoint: string, method: string) => {
      let errorMessage = "發生未知錯誤";
      let errorTitle = "API 錯誤";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Don't show error for authentication failures as they redirect
      if (
        error?.message?.includes("401") ||
        error?.status === 401 ||
        error?.message?.includes("403") ||
        error?.status === 403
      ) {
        return;
      }

      addError({
        type: "error",
        title: errorTitle,
        message: `${method} ${endpoint} 失敗: ${errorMessage}`,
        autoHide: true,
        autoHideDelay: 5000,
      });
    },
    [addError]
  );

  const get = useCallback(
    async <T>(endpoint: string): Promise<T | null> => {
      try {
        console.log(`🔍 API GET ${endpoint}`, {
          hasToken: !!accessToken,
          headers: headers,
        });
        const res = await fetch(`${API_BASE}${endpoint}`, { headers });
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
          return null;
        }
        if (!res.ok) {
          const errorMessage = `API Error: ${res.status} ${res.statusText}`;
          console.error(`GET ${endpoint} failed:`, errorMessage);
          handleApiError(new Error(errorMessage), endpoint, "GET");
          throw new Error(errorMessage);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        handleApiError(error, endpoint, "GET");
        throw error;
      }
    },
    [headers, handleApiError, handleAuthError, accessToken]
  );

  const post = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        handleApiError(error, endpoint, "POST");
        throw error;
      }
    },
    [headers, handleApiError, handleAuthError]
  );

  const put = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "PUT",
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`PUT ${endpoint} failed:`, error);
        handleApiError(error, endpoint, "PUT");
        throw error;
      }
    },
    [headers, handleApiError, handleAuthError]
  );

  const deleteMethod = useCallback(
    async <T>(endpoint: string): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "DELETE",
          headers,
        });
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
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
        handleApiError(error, endpoint, "DELETE");
        throw error;
      }
    },
    [headers, handleApiError, handleAuthError]
  );

  const patch = useCallback(
    async <T>(endpoint: string, data?: any): Promise<T | null> => {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "PATCH",
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
          return null;
        }
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        return res.json() as Promise<T>;
      } catch (error) {
        console.error(`PATCH ${endpoint} failed:`, error);
        handleApiError(error, endpoint, "PATCH");
        throw error;
      }
    },
    [headers, handleApiError, handleAuthError]
  );

  return {
    get,
    post,
    put,
    patch,
    delete: deleteMethod,
  };
};
