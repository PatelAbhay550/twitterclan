// src/components/Auth.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import Cookies from "js-cookie";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    const checkUserCookie = async () => {
      const userCookie = Cookies.get("user");

      if (userCookie) {
        const userData = JSON.parse(userCookie);

        try {
          if (userData.password) {
            // Attempt to sign in using the stored user data
            await signInWithEmailAndPassword(
              auth,
              userData.email,
              userData.password
            );
            console.log("Successfully signed in with stored user data");
            navigate("/");
          } else {
            console.error("Stored user data is missing a password.");
          }
        } catch (error) {
          console.error(
            "Error signing in with stored user data:",
            error.message
          );
        }
      }
    };

    checkUserCookie();
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      let user;

      if (isSignUp) {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;

        // Save additional user data to Firestore
        await addDoc(collection(firestore, "users"), {
          userId: user.uid,
          email: user.email,
          name: name.trim(),
          age: age.trim(),
          dob: dob.trim(),
          password: password,
        });
      } else {
        // Sign in logic
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
      }

      // Store user data in cookies (including the password)
      Cookies.set(
        "user",
        JSON.stringify({
          userId: user.uid,
          email: user.email,
          name: name.trim(),
          age: age.trim(),
          dob: dob.trim(),
          password: password,
        })
      );

      console.log(
        `Successfully ${
          isSignUp ? "signed up and created a new account" : "signed in"
        }`
      );

      navigate("/");
    } catch (error) {
      console.error("Error authenticating:", error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleAuth}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        {isSignUp && (
          <>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Age:
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <br />
            <label>
              Date of Birth:
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
            <br />
          </>
        )}
        <button className="auth-button" type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link className="auth-link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </Link>
      </p>
    </div>
  );
};

export default Auth;
