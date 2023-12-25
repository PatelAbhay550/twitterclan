import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUqRvntxqexEHXrrQnxv3KZ78SiHexAJs",
  authDomain: "twitter-6b2b9.firebaseapp.com",
  projectId: "twitter-6b2b9",
  storageBucket: "twitter-6b2b9.appspot.com",
  messagingSenderId: "820568059524",
  appId: "1:820568059524:web:d355a16c73ecb783329cd1",
  measurementId: "G-Q52YHTTVH2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
