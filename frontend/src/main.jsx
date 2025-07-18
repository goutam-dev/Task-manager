import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "antd/dist/reset.css";
import { App as AntdApp } from "antd";

import "@ant-design/v5-patch-for-react-19";
import { Analytics } from "@vercel/analytics/react";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AntdApp>
      <App />
      <Analytics />
    </AntdApp>
  </StrictMode>
);
