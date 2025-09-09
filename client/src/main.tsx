import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./hooks/use-theme.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx"; // ✅ fixed relative path
import {PropertyProvider} from './contexts/PropertyContext.jsx'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PropertyProvider>
        <App />   {/* ✅ App is now wrapped inside AuthProvider */}

        </PropertyProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
