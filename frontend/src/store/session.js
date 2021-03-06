import { csrfFetch } from "../store/csrf";

const SET_USER = "session/set";
const USER_RESET = "session/reset";

// Actions
const setUser = (userInfo) => ({
  type: SET_USER,
  payload: userInfo,
});

const resetUser = () => ({
  type: USER_RESET,
});

// Login Thunk
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch(`/api/session/`, {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  }
};

// Restore Session Thunk
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch(`/api/session`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return data.user;
  }
};

// Sign-Up user Thunk
export const signup = (user) => async (dispatch) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    about,
    city,
    state,
    address,
    profileImageUrl,
  } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      firstName,
      lastName,
      about,
      city,
      state,
      address,
      profileImageUrl,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Logout Thunk
export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(resetUser());
  return response;
};

// Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const newState = {
        ...state, // state returns everything inside of the store with more objects inside
        user: action.payload, // inside of the state there will be a key value object with key of user. we now set the value to the user passed in
      };
      return newState; // now the new state is our store
    }
    case USER_RESET: {
      const newState = {
        ...state,
        user: null,
      };
      return newState;
    }
    default:
      return state;
  }
};

export default sessionReducer;
