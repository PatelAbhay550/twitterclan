// UserProfile.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (userId) => {
    try {
      const usersCollection = collection(firestore, "users");
      const q = query(usersCollection, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // Assuming the data types for the fields
        const { age, dob, email, name, userId } = userData;
        setUserData({
          age: age || null,
          dob: dob || null,
          email: email || null,
          name: name || null,
          userId: userId || null,
        });
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  return (
    <div className="user-profile-container">
      {userData ? (
        <div>
          <h2 className="header">{userData.name}'s Profile</h2>
          <p className="info">Email: {userData.email}</p>
          <p className="info">Age: {userData.age}</p>
          <p className="info">Date of Birth: {userData.dob}</p>
          <Link to="/" className="link">
            Home
          </Link>
          {/* Add other user information here */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
