import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";

type DecodedJwt = {
  exp?: number;
  [key: string]: unknown;
};

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔐 AuthContext: Initializing...");
    const saved = localStorage.getItem("mm_access_token");
    console.log("🔐 AuthContext: Saved token exists:", !!saved);
    if (!saved) return;
    try {
      const decoded = jwtDecode<DecodedJwt>(saved);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        console.log("🔐 AuthContext: Token expired, removing...");
        localStorage.removeItem("mm_access_token");
        return;
      }
      console.log("🔐 AuthContext: Token valid, setting state");
      setAccessTokenState(saved);
    } catch (error) {
      console.log("🔐 AuthContext: Token invalid, removing...", error);
      localStorage.removeItem("mm_access_token");
    }
  }, []);

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem("mm_access_token", token);
    } else {
      localStorage.removeItem("mm_access_token");
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
  }, [setAccessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      setAccessToken,
      logout,
    }),
    [accessToken, logout, setAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
