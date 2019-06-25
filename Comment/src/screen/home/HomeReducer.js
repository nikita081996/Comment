import * as ActionTypes from "../../constants/ActionTypes";

const INITIAL_STATE = {
  isLoading: true,
  errMess: null,
  data: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COMMENT:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        data: action.payload
      };

    default:
      return state;
  }
};
