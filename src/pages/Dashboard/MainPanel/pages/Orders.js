import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import OrderTracking from './OrderTracking'

export default function Orders() {
  const { url, path } = useRouteMatch()
  // console.log("url", url)
  return (
    <Switch>
      {/* <Route path={`${url}/all`} render={() => <div>All</div>} /> */}
      <Route
        path={`${url}`}
        render={props => <OrderTracking {...props} />}
      />
      {/* <Route path={`${url}/past`} render={()=><div>Past</div>} /> */}
    </Switch>
  )
}
