import "@fontsource/inter";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./i18n";
import store from "./stores";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

window.global = window;
dayjs.extend(timezone);
dayjs.extend(utc);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
