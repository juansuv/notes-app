import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./redux/reducers";
import { composeWithDevTools } from '@redux-devtools/extension';
import { loadState } from "./utils/loadState";



const middleware = [thunk];

const store = createStore(
  rootReducer,
  loadState(),
  composeWithDevTools(applyMiddleware(...middleware))
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;


export default store;