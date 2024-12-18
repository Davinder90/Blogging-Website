import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRUp0iz2FNOKyb6SqQQHZE5SghOw3Ti54",
  authDomain: "react-js-blog-website-47934.firebaseapp.com",
  projectId: "react-js-blog-website-47934",
  storageBucket: "react-js-blog-website-47934.appspot.com",
  messagingSenderId: "844924602126",
  appId: "1:844924602126:web:de3465daf5293d82a6f95f",
  measurementId: "G-48856QB8HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

const authWithGoogle = async () => {
    let user;
    await signInWithPopup(auth, provider).then((result) => {
        user = result.user;
    }).catch((err) => {
        console.log(err);
    })
    return user;
}

export default authWithGoogle;