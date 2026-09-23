export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => Boolean(state.auth.user);
