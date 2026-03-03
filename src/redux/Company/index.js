import { UPDATE_COMPANY } from "./types";

const initState = "";

export default (state = initState, { type, payload }) => {
  switch (type) {
    case UPDATE_COMPANY:
      return payload;
    default:
      return state;
  }
};
