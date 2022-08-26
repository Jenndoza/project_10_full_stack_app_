import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import ErrorsDisplay from "./ErrorsDisplay";

export default function UserSingIn({ location, history, context }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const submit = (event) => {
    event.preventDefault();
    const { from } = location.state || {
      from: { pathname: "/" },
    };
    context.actions
      .signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          setErrors(() => ["Sign-in was unsuccessful"]);
        } else {
          history.push(from);
          console.log(`SUCCESS! ${emailAddress} is now signed in!`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancel = () => {
    history.push("/");
  };

  return (
    <main>
      <div className="form--centered">
        <h2>Sign In</h2>
        {errors.length > 0 && <ErrorsDisplay errors={errors} />}
        <form onSubmit={submit}>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Sign In
          </button>
          <button
            className="button button-secondary"
            onClick={() => history.push("/")}
          >
            Cancel
          </button>
        </form>
        <p>
          Don't have a user account ? Click here to{" "}
          <Link to={"/signup"}>sign up</Link> !
        </p>
      </div>
    </main>
  );
}
