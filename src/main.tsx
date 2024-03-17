import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "normalize.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { App as AppShell } from "antd";
import { AuthProvider } from "./hooks/useAuth.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppShell
          notification={{
            stack: {
              threshold: 2,
            },
            maxCount: 4,
          }}
          style={{ height: "100%" }}
        >
          <App />
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
