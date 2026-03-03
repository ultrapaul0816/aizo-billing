const initState = {
  orderSource: [],
  charges: [],
  tax: [],
  filters: [],
  brandInfo: {},
};

export const types = {
  GET_SOURCE: "GET_SOURCE",
  GET_CHARGES: "GET_CHARGES",
  GET_TAXES: "GET_TAXES",
  GET_FILTERS: "GET_FILTERS",
  GET_BRAND_INFO: "GET_BRAND_INFO",
};

export default (state = initState, actions) => {
  switch (actions.type) {
    case types.GET_SOURCE:
      return { ...state, orderSource: actions.payload };
    case types.GET_CHARGES:
      return { ...state, charges: actions.payload };
    case types.GET_TAXES:
      return { ...state, tax: actions.payload };
    case types.GET_FILTERS:
      return { ...state, filters: actions.payload };
    case types.GET_BRAND_INFO:
      return { ...state, brandInfo: actions.payload };
    default:
      return state;
  }
};

export const actions = {
  getSource: (payload) => ({
    type: types.GET_SOURCE,
    payload: payload,
  }),
  getCharges: (payload) => ({
    type: types.GET_CHARGES,
    payload: payload,
  }),
  getTaxes: (payload) => ({
    type: types.GET_TAXES,
    payload: payload,
  }),
  getFilters: (payload) => ({
    type: types.GET_FILTERS,
    payload: payload,
  }),
  getBrandInfo: (payload) => ({
    type: types.GET_BRAND_INFO,
    payload: payload,
  }),
};
