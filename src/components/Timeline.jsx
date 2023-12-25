import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

import { firestore } from "../firebase";

const Timeline = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsCollection = collection(firestore, "tweets");
        const q = query(tweetsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const tweetsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageUrl = data.imageUrl;

            if (imageUrl) {
              // Get the download URL for each image
              const imageURL = await getDownloadURL(ref(storage, imageUrl));
              return { ...data, imageUrl: imageURL }; // Rename the variable to avoid shadowing
            }

            return data;
          })
        );

        setTweets(tweetsData);
      } catch (error) {
        console.error("Error fetching tweets:", error.message);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div>
      <div className="add-links">
        <h2>Home</h2>
        <Link to="/tweet">Add Tweet</Link>
        <br />
        <Link to="/Profile">View Profile</Link>
      </div>
      <div className="tw-op">
        {tweets.map((tweet) => (
          <div className="tweet" key={tweet.id}>
            <p>{tweet.message}</p>
            {tweet.imageUrl && (
              <img
                className="img-tw"
                src={tweet.imageUrl}
                alt={tweet.message}
              />
            )}
            <hr />
            <Link to={`/profile/${tweet.userId}`}>{tweet.name}</Link>
            <br />
            <small className="timestamp">
              {tweet.timestamp && tweet.timestamp.toDate().toString()}
            </small>
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export default Timeline;
