import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

console.log("🎬 Application Starting...");
console.log("  Environment:", import.meta.env.MODE);
console.log("  API URL:", import.meta.env.VITE_API_URL);
console.log("  Base URL:", window.location.origin);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error("🔴 React Query Error:", error);
      },
    },
  },
});

console.log("✅ QueryClient initialized");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

console.log("✅ React app rendered");
