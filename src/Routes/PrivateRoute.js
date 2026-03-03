import React, { useEffect } from 'react'
import { useHistory, Route, Redirect } from 'react-router-dom'
import { updatePermissions } from '../redux/Permissions/actions'
import { useDispatch } from 'react-redux'

export default function PrivateRoute(props) {
  // const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch(updatePermissions(user.permissions))
    }
  }, [])
  if (localStorage) {
    return !!localStorage.getItem('user') ? (
      <Route {...props} />
    ) : (
      <Redirect to='/' />
    )
  } else {
    return <Redirect to='/' />
  }
}
