import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { firestore } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import Modal from "react-modal";

const Timeline = ({ user }) => {
  const [tweets, setTweets] = useState([]);
  const [selectedTweet, setSelectedTweet] = useState(null);
  Modal.setAppElement("#root");
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsCollection = collection(firestore, "tweets");
        const q = query(tweetsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const tweetsData = await Promise.all(
          querySnapshot.docs.map(async (tweetDoc) => {
            const data = tweetDoc.data();
            const imageUrl = data.imageUrl;

            if (imageUrl) {
              const imageURL = await getDownloadURL(ref(storage, imageUrl));
              return { ...data, imageUrl: imageURL, tweetId: tweetDoc.id };
            }

            return { ...data, tweetId: tweetDoc.id };
          })
        );

        setTweets(tweetsData);
      } catch (error) {
        console.error("Error fetching tweets:", error.message);
      }
    };

    fetchTweets();
  }, []);

  const openModal = (tweet) => {
    setSelectedTweet(tweet);
  };

  const closeModal = () => {
    setSelectedTweet(null);
  };

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
          <div className="tweet" key={tweet.tweetId}>
            <p>{tweet.message}</p>

            {tweet.imageUrl && (
              <img
                className="img-tw"
                src={tweet.imageUrl}
                alt={tweet.message}
                onClick={() => openModal(tweet)}
              />
            )}

            <hr />
            <Link to={`/profile/${tweet.userId}`}>{tweet.name}</Link>
            <br />
            <small className="timestamp">
              {tweet.timestamp && tweet.timestamp.toDate().toString()}
            </small>
            <br />
            <Link to={`/comments/${tweet.tweetId}`}>Comment</Link>
          </div>
        ))}
      </div>

      {/* Modal for displaying the selected tweet */}
      <Modal
        isOpen={selectedTweet !== null}
        onRequestClose={closeModal}
        contentLabel="Tweet Modal"
      >
        {selectedTweet && (
          <>
            <p>{selectedTweet.message}</p>
            <p> by: {selectedTweet.name}</p>
            {selectedTweet.imageUrl && (
              <img
                className="img-tw-pop"
                src={selectedTweet.imageUrl}
                alt={selectedTweet.message}
              />
            )}
            <br />
            <button onClick={closeModal}>Close</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Timeline;
