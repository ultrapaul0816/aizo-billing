import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import orderReducer from "./Orders";
import outletReducer from "./Outlet";
import permissionsReducer from "./Permissions";
import company from "./Company";
import Config from "./Config";
import thunk from "redux-thunk";

export default (initState) => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const rootReducer = combineReducers({
    orders: orderReducer,
    permissions: permissionsReducer,
    outlets: outletReducer,
    Config: Config,
    Company: company,
  });
  const store = createStore(
    rootReducer,
    initState,
    composeEnhancers(applyMiddleware(thunk))
  );
  // store.subscribe(() => {
  //   console.log("Redux State:", store.getState());
  // });
  return store;
};
