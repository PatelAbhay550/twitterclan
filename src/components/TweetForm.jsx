import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebase";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

const TweetForm = ({ user }) => {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePostTweet = async () => {
    try {
      if (!user) {
        console.log("User not authenticated. Cannot post tweet.");
        return;
      }

      if (!tweetMessage.trim()) {
        console.log("Tweet message is empty");
        return;
      }

      setUploading(true);

      let imageUrl = null;

      if (tweetImage) {
        if (allowedImageTypes.includes(tweetImage.type)) {
          try {
            const storageRef = ref(
              storage,
              `tweet-images/${user.uid}/${uuidv4()}.${
                tweetImage.type.split("/")[1]
              }`
            );
            const snapshot = await uploadBytes(storageRef, tweetImage);
            imageUrl = await getDownloadURL(snapshot.ref);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            toast.error("Error uploading image");
            setUploading(false);
            return;
          }
        } else {
          console.log("Invalid image type or no tweetImage provided");
          toast.error("Invalid image type or no image provided");
          setUploading(false);
          return;
        }
      }

      const tweetId = uuidv4();
      const tweetsCollection = collection(firestore, "tweets");
      await addDoc(tweetsCollection, {
        tweetId: tweetId,
        userId: user.uid,
        message: tweetMessage,
        timestamp: new Date(),
        name: user.email,
        imageUrl: imageUrl,
        likesCount: 0,
      });

      setTweetMessage("");
      setTweetImage(null);
      setUploading(false);

      // Show success notification
      toast.success("Tweet posted successfully!");
    } catch (error) {
      console.error("Error posting tweet:", error.message);
      toast.error("Error posting tweet");
    }
  };

  return (
    <div className="tweet-form-container">
      <h2>Post a Tweet</h2>
      <textarea
        className="tweet-message-input"
        value={tweetMessage}
        onChange={(e) => setTweetMessage(e.target.value)}
        placeholder="What's happening?"
        rows="4"
        cols="50"
      />
      <br />
      <input
        className="tweet-image-input"
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={(e) => setTweetImage(e.target.files[0])}
      />
      {uploading && <div className="red-bar">Uploading...</div>}
      <br />
      <button className="post-tweet-button" onClick={handlePostTweet}>
        Post Tweet
      </button>
      <Link to="/" className="go-to-home-button">
        <button className="full-width">Go To Home</button>
      </Link>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default TweetForm;
