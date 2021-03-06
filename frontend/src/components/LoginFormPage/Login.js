import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";

import { showModal, setCurrentModal, hideModal } from "../../store/modal";
import SignupFormPage from "../SignUpPage/index";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user); // grab the user to see if there is a one or not
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]); // to be used with catching errors if there are any

  if (sessionUser) return <Redirect to="/" />; // if there is a logged in user then redirect home

  const showSignUp = () => {
    dispatch(setCurrentModal(SignupFormPage));
    dispatch(showModal());
  };

  // We handle our form submission with this function that will prevent default
  // and will check if there are errors. If no errors then it will dispatch the thunk
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    dispatch(hideModal());
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  // in the display there will be a form which will map through errors if there are any errors
  // there will be an input to enter a credential (email or username) onChange same for a password
  return (
    <div className="background__login">
      <div className="loginForm">
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <div className="login__holder">
            <div>
              <label className="login__text">Username</label>
            </div>
            <input
              className="input_review"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>
          <div className="login__holder">
            <div>
              <label className="login__text">Password</label>
            </div>
            <input
              className="input_review"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="loginButton">
            <button className="login__button" type="submit">
              Log In
            </button>
          </div>
          <div className="logRedirects">
            <div className="signupButton__login">
              <div>
                <button className="login__button" onClick={showSignUp}>
                  Signup
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="DemoContainer">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                value="Spidey"
                required
                hidden
              />
            </div>
            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value="password"
                required
                hidden
              />
            </div>
            <div className="loginButton">
              <button className="login__button" type="submit">
                Demo User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
