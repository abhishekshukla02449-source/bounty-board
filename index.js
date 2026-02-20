import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";   // ✅ must match the export in App.js

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
