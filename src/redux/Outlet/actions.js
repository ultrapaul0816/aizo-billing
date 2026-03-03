import { FETCH_OUTLET } from './types'
import { OutletManagementAPI } from '../../api'

export const gloabalFetchOutlets = () => dispatch => {
  OutletManagementAPI.listOutlets().then(res =>
    dispatch({
      type: FETCH_OUTLET,
      payload: res
    })
  )
}
