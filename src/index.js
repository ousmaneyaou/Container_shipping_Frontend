import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n"; // i18n doit être importé avant le rendu
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Impossible de trouver l'élément racine pour React.");
}

// Optionnel : mesurer les performances
reportWebVitals();
