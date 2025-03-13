import * as React from "react";
import { createRoot } from 'react-dom/client';
import HotelBook from "../components/HotelBook/HotelBook";
import "../../styles/index.css";

const root = createRoot(document.getElementById("content-area") as HTMLElement);
root.render(
  <HotelBook />
);
