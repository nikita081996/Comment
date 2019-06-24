import * as ActionTypes from "../../constants/ActionTypes";

export const fetchUser = () => dispatch => {
  const firebase = require("firebase");

  const playersRef = firebase.database().ref("comment/");

  return playersRef
    .orderByChild("parentCommentId")
    .equalTo("")
    .on("value", data => {
      dispatch(addLeaders(data));
    });
};

export const addLeaders = data => ({
  type: ActionTypes.FETCH_IMAGES,
  payload: data
});
