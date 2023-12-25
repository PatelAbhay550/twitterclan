// src/components/Timeline.js
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";

const Timeline = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsCollection = collection(firestore, "tweets");
        const q = query(tweetsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const tweetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(tweetsData);
      } catch (error) {
        console.error("Error fetching tweets:", error.message);
      }
    };

    fetchTweets();
  }, []); // Pass an empty dependency array to ensure useEffect runs only once when the component mounts.

  return (
    <div>
      <div className="add-links">
        <h2>Home</h2>
        <Link to="/tweet">Add Tweet</Link>
        <br />
        {/* Link to the UserProfile component */}
        <Link to="/Profile">View Profile</Link>
      </div>
      {tweets.map((tweet) => (
        <div className="tweet" key={tweet.id}>
          <p>{tweet.message}</p>
          <hr />
          {/* Link to the UserProfile component */}
          <Link to={`/profile/${tweet.userId}`}>{tweet.name}</Link>
          <br />
          <small className="timestamp">
            {tweet.timestamp && tweet.timestamp.toDate().toString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
