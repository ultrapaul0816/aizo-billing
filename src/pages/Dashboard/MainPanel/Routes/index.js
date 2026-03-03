import React, { lazy, Suspense } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "@blueprintjs/core";
import { Loader } from "../../../../components/Loader";

const Orders = lazy(() =>
  import(/* webpackChunkName: "orders" */ "../pages/Orders")
);
const Outlets = lazy(() =>
  import(/* webpackChunkName: "outlets" */ "../pages/Outlets")
);
const Billing = lazy(() =>
  import(/* webpackChunkName: "billing" */ "../pages/Billing")
);
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings" */ "../pages/Settings")
);
const Attendance = lazy(() =>
  import(/* webpackChunkName: "attendance" */ "../pages/Attendance")
);
const Reports = lazy(() =>
  import(/* webpackChunkName: "report" */ "../pages/Reports/")
);
const Forms = lazy(() =>
  import(/* webpackChunkName: "report" */ "../pages/Forms/")
);

export default function Routes() {
  const { url } = useRouteMatch();
  const { catalog } = useSelector((state) => state.permissions);
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path={`${url}/`} component={Orders} />
        <Route path={`${url}/outlets`} component={Outlets} />
        {/* <Route path={`${url}/orders`} component={Orders} /> */}
        <Route path={`${url}/reports`} component={Reports} />
        {catalog && <Route path={`${url}/billing`} component={Billing} />}
        <Route path={`${url}/settings`} component={Settings} />
        <Route path={`${url}/attendance`} component={Attendance} />
        <Route path={`${url}/reports`} component={Reports} />
        <Route path={`${url}/Forms`} component={Forms} />
      </Switch>
    </Suspense>
  );
}
