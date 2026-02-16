import React from "react";
import ReactDOM from "react-dom/client";
import { initTelegram } from "./tg/init";
import App from "./app";
import "./ui/styles.css";

initTelegram();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
