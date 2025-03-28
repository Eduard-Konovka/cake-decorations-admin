const actions = {
  updateUserProfile: (state, payload) => {
    localStorage.setItem('user', JSON.stringify(payload));

    const updatedState = { ...state };
    updatedState.auth.user = payload;
    return updatedState;
  },
};

export const { updateUserProfile } = actions;
