import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

<<<<<<< HEAD
createRoot(document.getElementById("root")).render(
=======
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import "./index.css"; // 👈 QUAN TRỌNG

ReactDOM.createRoot(document.getElementById('root')).render(
>>>>>>> 75b087fa26a87d74313f6378738ecd8b7b904d2b
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
