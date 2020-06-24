// ACTION TYPES //
export const types = {
  REQUESTS_TYPE: "REQUESTS_TYPE"
};

// REDUCERS //
export const initialState = {
  type: "Request"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUESTS_TYPE:
      return {
        ...state,
        type: action.payload.type
      };

    default:
      return state;
  }
};

// ACTIONS //
export const requestTypeChange = type => ({
  type: types.REQUESTS_TYPE,
  payload: { type }
});
