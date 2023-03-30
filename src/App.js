import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/";

const Account = lazy(() => import("./pages/Account/Account"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));

const App = () => {
  return (
    <div className="flex flex-col h-full">
      <Router>
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/account" element={<Account />}></Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
