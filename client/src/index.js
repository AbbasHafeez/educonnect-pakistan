import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import WishlistProvider from "./context/WishlistContext"; // ✅ Wishlist context

// ✅ Get root element safely
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found in the DOM. App cannot be mounted.");
} else {
  // ✅ Use React 18's createRoot API
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
}
