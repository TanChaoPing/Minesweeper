import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div id="main">
      <center>
        <br />
        <img
          src="/ms-logo.png"
          alt="Minesweeper Logo"
          width="500"
          height="93"
        />
        <hr class="lines" />
        <h2>Please select a difficulty below to proceed.</h2>
      </center>
      <App />
    </div>
  </StrictMode>
);
