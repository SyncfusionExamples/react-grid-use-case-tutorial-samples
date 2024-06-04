import HotelBookApp from './HotelBookApp';
import * as serviceWorker from './serviceWorker';
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("App");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <HotelBookApp />
  </StrictMode>
);

serviceWorker.unregister();
