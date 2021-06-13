import React from "react";
import "./App.css";
import { Skeleton } from "antd";
import { BrowserRouter, Route } from "react-router-dom";

const Login = React.lazy(() => import("@/pages/Login"));

function App() {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <BrowserRouter>
        <Route path="/" component={Login}></Route>
      </BrowserRouter>
    </React.Suspense>
  );
}

export default App;
