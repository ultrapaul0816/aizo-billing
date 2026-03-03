import { UPDATE_PERMISSIONS } from './types'

const initState = {}

export default (state = initState, { type, payload }) => {
  switch (type) {
    case UPDATE_PERMISSIONS:
      return payload
    default:
      return state
  }
}
