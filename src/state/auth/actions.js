const actions = {
  updateUserProfile: (state, payload) => {
    const updatedState = { ...state };
    updatedState.auth.userId = payload.userId;
    updatedState.auth.name = payload.name;
    return updatedState;
  },

  authSignOut: (state, payload) => {
    const updatedState = { ...state };
    updatedState.auth = payload;
    return updatedState;
  },

  authStateChange: (state, payload) => {
    const updatedState = { ...state };
    updatedState.auth.stateChange = payload;
    return updatedState;
  },
};

export const { updateUserProfile, authSignOut, authStateChange } = actions;
