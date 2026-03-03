import { ADD_ORDER, DELETE_ORDER, UPDATE_ORDER, CLEAR_ORDERS } from './types'

const initState = []

export default (state = initState, { type, payload }) => {
  switch (type) {
    case ADD_ORDER:
      return [...payload]
    case UPDATE_ORDER:
      return [...state.map(o => (o.id === payload.id ? { ...o, ...payload } : o))]
    case DELETE_ORDER:
      return { id: payload, action: 'delete' }
    case CLEAR_ORDERS:
      return []
    default:
      return state
  }
}
