import React from "react";
import ThemeProvider from "./theme";
import Router from "./routes/routes";
import { StyledChart } from "./components/chart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useScrollToTop } from "./hooks/useScrollToTop";

function App() {
  useScrollToTop();

  return (
    <React.Fragment>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <ThemeProvider>
        <StyledChart />
        <Router />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
