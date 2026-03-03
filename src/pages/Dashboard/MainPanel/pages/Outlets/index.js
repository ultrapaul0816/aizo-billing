import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Billing from '../Billing'
import OutletsList from './OutletsList'

export default function Outlets({ match }) {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/`}
        render={props => <OutletsList {...props} />}
      />
    </Switch>
  )
}
