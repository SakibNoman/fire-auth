import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from './firebase.config';


if (firebase.apps.length === 0) { firebase.initializeApp(firebaseConfig); }

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        console.log(res);
      })
  }

  const handleBlur = e => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length >= 6;
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && isPasswordHasNumber;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }

  }

  const handleSubmit = (e) => {
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);

        });
    }
    e.preventDefault();
  }
  return (
    <div className="App">
      <button onClick={handleSignIn}  >Sign In</button>

      {/* <h1>Our Own Authentication</h1>
      <h3>Name: {user.name}</h3>
      <h4>Email: {user.email}</h4>
      <h4>Password: {user.password}</h4> */}
      <form onSubmit={handleSubmit}>
        <input onBlur={handleBlur} type="text" name="name" placeholder="Your name" /> <br />
        <input onBlur={handleBlur} type="text" name="email" placeholder="Your email" />
        <br />
        <input onBlur={handleBlur} type="password" name="password" placeholder="Your password" />
        <br />
        <input type="submit" value="SUBMIT" />
      </form>
    </div>
  );
}

export default App;
