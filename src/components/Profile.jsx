// src/components/Profile.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
const Profile = ({ user }) => {
  const [profileUser, setProfileUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const usersCollection = collection(firestore, "users");
        const q = query(
          usersCollection,
          where("userId", "==", userId || user.uid)
        );
        const querySnapshot = await getDocs(q);

        console.log("Query Snapshot:", querySnapshot.docs);

        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          setProfileUser(userData);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [userId, user.uid]);

  return (
    <div>
      {profileUser ? (
        <div>
          <h2>{profileUser.name}'s Profile</h2>
          <p>Email: {profileUser.email}</p>
          <p>Name: {profileUser.name}</p>
          <p>Age: {profileUser.age}</p>
          <p>DOB: {profileUser.dob}</p>
          <Link to="/">Home</Link>

          {/* Display additional profile information as needed */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Profile;
