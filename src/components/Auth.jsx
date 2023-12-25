// src/components/Auth.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import collection and addDoc
import { auth, firestore } from "../firebase";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState(""); // Add state for name
  const [age, setAge] = useState(""); // Add state for age
  const [dob, setDob] = useState(""); // Add state for dob

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigate("/");
        const user = userCredential.user;

        // Save additional user data to Firestore
        await addDoc(collection(firestore, "users"), {
          userId: user.uid,
          email: user.email,
          name: name.trim(), // Trim to remove leading/trailing spaces
          age: age.trim(),
          dob: dob.trim(),
        });
      } else {
        // Sign in logic
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      }

      navigate("/");
    } catch (error) {
      console.error("Error authenticating:", error.message);
    }
  };

  return (
    <div>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
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
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </Link>
      </p>
    </div>
  );
};

export default Auth;
