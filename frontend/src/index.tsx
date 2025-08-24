import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="861849830529-44mlejpcr9jjhh19qbvib8vjfbo42gea.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
