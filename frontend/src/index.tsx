import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";

// 直接啟動應用，使用真實後端 API
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="861849830529-44mlejpcr9jjhh19qbvib8vjfbo42gea.apps.googleusercontent.com">
        <ErrorProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
