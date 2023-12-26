import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const auth = getAuth();

    const fetchUserProfile = async () => {
      try {
        const usersCollection = collection(firestore, "users");

        let targetUserId;
        if (userId) {
          // If userId is provided in the URL, use it
          targetUserId = userId;
        } else {
          // If userId is not provided, use the currently authenticated user's UID
          const auth = getAuth();
          targetUserId = auth.currentUser.uid;
        }

        const q = query(usersCollection, where("userId", "==", targetUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          setProfileUser(userData);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile();
      } else {
        console.log("User not authenticated.");
      }
    });

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, [userId]);

  return (
    <div>
      {profileUser ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {profileUser.name}</p>
          <p>Email: {profileUser.email}</p>
          <p>Age: {profileUser.age}</p>
          <p>DOB: {profileUser.dob}</p>
          <Link to="/" className="link">
            Home
          </Link>
          {/* Add more profile details as needed */}
        </div>
      ) : (
        <p>Profile page under maintainance...</p>
      )}
    </div>
  );
};

export default Profile;
