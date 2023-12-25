import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
const TweetForm = ({ user }) => {
  const [tweetMessage, setTweetMessage] = useState("");

  const handlePostTweet = async () => {
    try {
      // Ensure the tweet message is not empty
      if (!tweetMessage.trim()) {
        return;
      }

      // Add the tweet to the Firestore database
      const tweetsCollection = collection(firestore, "tweets");
      await addDoc(tweetsCollection, {
        userId: user.uid,
        message: tweetMessage,
        timestamp: new Date(),
        name: user.email,
      });

      // Clear the tweet message input
      setTweetMessage("");
      console.log("Tweet posted successfully!");
    } catch (error) {
      console.error("Error posting tweet:", error.message);
    }
  };

  return (
    <div>
      <h2>Post a Tweet</h2>
      <textarea
        value={tweetMessage}
        onChange={(e) => setTweetMessage(e.target.value)}
        placeholder="What's happening?"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handlePostTweet}>Post Tweet</button>
      <Link to="/">
        <button>Go To Home</button>
      </Link>
    </div>
  );
};

export default TweetForm;
