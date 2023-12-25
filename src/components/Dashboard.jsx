import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import TweetForm from "./TweetForm";

const Dashboard = ({ user }) => {
  const [allTweets, setAllTweets] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const navigate = useNavigate();

  const fetchAllTweets = async () => {
    try {
      const tweetsCollection = collection(firestore, "tweets");
      const allTweetsSnapshot = await getDocs(tweetsCollection);

      const allTweetsData = allTweetsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllTweets(allTweetsData);
    } catch (error) {
      console.error("Error fetching all tweets:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllTweets();
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleNewPost = async () => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const tweetsCollection = collection(firestore, "tweets");
      await addDoc(tweetsCollection, {
        userId: user.uid,
        message: newPostContent,
        timestamp: new Date(),
      });

      fetchAllTweets();

      setNewPostContent("");
    } catch (error) {
      console.error("Error adding new tweet:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName || user.email}!</h2>

          <p>Email: {user.email}</p>
          <Link to="/dashboard" className="link-button">
            Home
          </Link>

          <h3>All Tweets</h3>
          <ul>
            {allTweets.map((tweet) => (
              <li key={tweet.id}>
                <h4>{tweet.message}</h4>
                <p>
                  Author: {tweet.userId === user.uid ? "You" : "Someone else"}
                </p>
              </li>
            ))}
          </ul>

          <div className="tweet-form">
            <h3>Post a New Tweet</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening?"
              rows="4"
              cols="50"
            />
            <br />
            <button onClick={handleNewPost}>Post Tweet</button>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
