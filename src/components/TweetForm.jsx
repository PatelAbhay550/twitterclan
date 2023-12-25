// ... (import statements)
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { firestore, storage } from "../firebase";
import { Link } from "react-router-dom";
import imageToBlob from "image-to-blob";

// ... (import statements)
// ... (import statements)

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

const TweetForm = ({ user }) => {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState(null);

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

      let imageUrl = null;

      if (tweetImage) {
        if (allowedImageTypes.includes(tweetImage.type)) {
          try {
            // Create a reference for the tweet image in Storage
            const storageRef = ref(
              storage,
              `tweet-images/${user.uid}/${Date.now()}.${
                tweetImage.type.split("/")[1]
              }`
            );

            // Upload the image to Storage using the uploadBytes method
            const snapshot = await uploadBytes(storageRef, tweetImage);

            // Get the download URL for the uploaded image
            imageUrl = await getDownloadURL(snapshot.ref);
          } catch (uploadError) {}
        } else {
          console.log("Invalid image type or no tweetImage provided");
          // Provide feedback to the user in the UI if needed
        }
      } else {
        console.log("No tweetImage provided");
        // Provide feedback to the user in the UI if needed
      }

      // Add the tweet to the Firestore database
      const tweetsCollection = collection(firestore, "tweets");
      await addDoc(tweetsCollection, {
        userId: user.uid,
        message: tweetMessage,
        timestamp: new Date(),
        name: user.email,
        imageUrl: imageUrl,
      });

      setTweetMessage("");
      setTweetImage(null);
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
      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={(e) => setTweetImage(e.target.files[0])}
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
