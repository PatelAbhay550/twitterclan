import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase"; // Removed timestamp as it's not used here

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async () => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Add user information to Firestore
      const user = userCredential.user;
      await firestore.collection("users").doc(user.uid).set({
        displayName,
        email,
      });

      // Redirect to the dashboard or another page after successful sign-up
      navigate("/home");
    } catch (error) {
      console.error("Sign-up error:", error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>Display Name:</label>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
