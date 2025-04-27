import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Import Provider from react-redux
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import store from "./context/store";
// Get the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app with Redux Provider
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap your App component with the Provider */}
      <AuthProvider>
        {" "}
        {/* Your existing AuthContext provider */}
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
