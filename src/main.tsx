import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter";
import App from "./App";
import { Provider } from "react-redux";
import store from "./stores";
import "./i18n";

// @ts-expect-error this global is needed for sock js to work properly
window.global = window;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
