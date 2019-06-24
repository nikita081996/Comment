import { combineReducers } from "redux";
import HomeReducer from "../screen/home/HomeReducer";

export default combineReducers({
  user: HomeReducer
});
