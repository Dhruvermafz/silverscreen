import { useLocation } from "react-router-dom";
import Router from "./router/Router";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
function App() {
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/signup",
    "/404",
    "/reset-password",
    "/forgot-password",
  ].includes(location.pathname);

  // Protected route component

  return (
    <main class="wrapper sb-default">
      {!isAuthPage && <Header />}
      <div class="mn-main-content">
        <Router />
      </div>
    </main>
  );
}

export default App;
