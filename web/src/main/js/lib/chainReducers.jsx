/**
 * Utility method for mapping an action type to a reducer method. Follows
 * the builder pattern to provide the reducer and state to pass to the
 * reducer.
 *
 * @param actionType
 * @returns {{to: to}}
 */
export function map(actionType) {
  return {
    /**
     * Builder pattern to provide the reducer function for a given action type
     * @param reducer
     * @returns {function(state, action)}
     */
    to: function(reducer) {
      if (typeof reducer !== "function") {
        throw "Invalid reducer specified: " + reducer + " of type " + (typeof reducer);
      }

      return (state, action) => {
        if(action.type === actionType) {
          return reducer(state, action);
        } else {
          return state;
        }
      }
    }
  }
}

/**
 * Chain reducers together into a single reducer function that calls the
 * array of given reducers, each potentially reducing the state in order.
 * @param reducers
 * @returns {function()}
 */
export function chainReducers(...reducers) {
  return (state, action) => {
    return reducers.reduce((previousState, reducer) => {
      return reducer(previousState, action)
    }, state);
  }
}