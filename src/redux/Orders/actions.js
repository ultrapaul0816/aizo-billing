import { ADD_ORDER, DELETE_ORDER, UPDATE_ORDER, CLEAR_ORDERS } from './types'

export const addOrder = order => ({ type: ADD_ORDER, payload: order })
export const deleteOrder = id => ({ type: DELETE_ORDER, payload: id })
export const updateOrder = data => ({ type: UPDATE_ORDER, payload: data })
export const clearAllOrders = () => ({ type: CLEAR_ORDERS, payload: null })
