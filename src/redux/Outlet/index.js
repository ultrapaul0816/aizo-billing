import { FETCH_OUTLET } from "./types";

const initState = [];

export default (state = initState, { type, payload }) => {
  switch (type) {
    case FETCH_OUTLET:
      return payload;
    default:
      return state;
  }
};
