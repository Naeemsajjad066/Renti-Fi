import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./hooks/use-theme.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { PropertyProvider } from './contexts/PropertyContext.jsx';
import { LoadingProvider } from './contexts/LoadingContext.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';
import { ReviewProvider } from './contexts/ReviewContext.jsx';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <PropertyProvider>
            <BookingProvider>
              <ReviewProvider>
                <App />
              </ReviewProvider>
            </BookingProvider>
          </PropertyProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </React.StrictMode>
);
