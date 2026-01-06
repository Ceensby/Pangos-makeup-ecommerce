import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);



