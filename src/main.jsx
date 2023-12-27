import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);
