import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";

const Comment = ({ user }) => {
  const { tweetId } = useParams();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const commentsCollection = collection(firestore, "comments");
    const q = query(commentsCollection, where("tweetId", "==", tweetId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [tweetId]);

  const handlePostComment = async () => {
    try {
      if (!user || !user.uid) {
        console.log("User not authenticated. Cannot post comment.");
        return;
      }

      if (!commentText.trim()) {
        console.log("Comment is empty");
        return;
      }

      const commentsCollection = collection(firestore, "comments");

      await addDoc(commentsCollection, {
        userId: user.uid,
        tweetId: tweetId,
        text: commentText,
        timestamp: new Date(),
      });

      setCommentText("");
      console.log("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  return (
    <div className="comment-container">
      <h2 className="comment-header">Comments</h2>
      <div className="comment-list" key={comments.key}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>{user.name}</p>
            <p>{comment.text}</p>
            <small className="comment-timestamp">
              {comment.timestamp && comment.timestamp.toDate().toString()}
            </small>
            {/* Add user information or other comment details as needed */}
          </div>
        ))}
      </div>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment..."
        rows="4"
        cols="50"
        className="comment-textarea"
      />
      <br />
      <button onClick={handlePostComment} className="post-comment-button">
        Post Comment
      </button>
      <br />
      <Link to="/" className="profile-link">
        Home
      </Link>
    </div>
  );
};

export default Comment;
