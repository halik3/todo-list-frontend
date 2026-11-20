import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#ffffff",
          color: "#1e3a8a",
          border: "1px solid #bfdbfe",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 4px 16px -4px rgba(37, 99, 235, 0.2)",
        },
        success: {
          iconTheme: { primary: "#2563eb", secondary: "#ffffff" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
        },
      }}
    />
  </React.StrictMode>
);