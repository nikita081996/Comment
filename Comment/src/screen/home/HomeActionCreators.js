import * as ActionTypes from "../../constants/ActionTypes";

export const fetchComment = () => dispatch => {
  const firebase = require("firebase");

  const commentRef = firebase.database().ref("comment/");

  return commentRef
    .orderByChild("parentCommentId")
    .equalTo("")
    .on("value", data => {
      dispatch(addComments(data));
    });
};

export const addComments = data => ({
  type: ActionTypes.FETCH_COMMENT,
  payload: data
});
