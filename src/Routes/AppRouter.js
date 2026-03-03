import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import { Loader } from "../components/Loader";

const Auth = lazy(() =>
  import(/* webpackChunkName: "notfound" */ "../pages/Auth")
);
const NotFound = lazy(() =>
  import(/* webpackChunkName: "notfound" */ "../pages/Error/NotFound")
);
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard" */ "../pages/Dashboard")
);
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/" exact component={Auth} />
          <PrivateRoute path="/home" component={Dashboard} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
