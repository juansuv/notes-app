import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./redux/reducers";
import { composeWithDevTools } from '@redux-devtools/extension';
import { loadState } from "./utils/loadState";



const preloadedState = loadState(); // Carga el estado inicial

const middleware = [thunk];

const store = createStore(
  rootReducer,
  preloadedState,
  //applyMiddleware(...middleware)
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;