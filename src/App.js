import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from './firebase.config';


if (firebase.apps.length === 0) { firebase.initializeApp(firebaseConfig); }

function App() {

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    success: false
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const ghProvider = new firebase.auth.GithubAuthProvider();
  const TwitterProvider = new firebase.auth.TwitterAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        console.log(res);
      })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
      .then((result) => {
        var credential = result.credential;
        var user = result.user;
        var accessToken = credential.accessToken;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }

  const handleGhSignIn = () => {
    firebase.auth().signInWithPopup(ghProvider)
      .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        console.log(user);
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorMessage);
      });
  }

  const handleTwitterSignIn = () => {
    console.log("Under Developing");
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
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(userCredential);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }
    e.preventDefault();
  }
  const updateUserName = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      // Update successful.
      console.log("Update Successfully");
    }).catch(function (error) {
      console.log('An error happened.');
    });
  }
  return (
    <div className="App">
      <button onClick={handleSignIn}  >Sign In Using Google</button>
      <br />
      <button onClick={handleTwitterSignIn}  >Sign In Using Twitter</button>
      <br />
      <button onClick={handleGhSignIn}  >Sign In Using Github</button>
      <br />
      <button onClick={handleFbSignIn} >Sign In Using Facebook</button>

      <h1>Our Own Authentication</h1>
      {/* <h3>Name: {user.name}</h3>
      <h4>Email: {user.email}</h4>
      <h4>Password: {user.password}</h4> */}
      <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" />
      <label htmlFor="newUser">New user sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Your name" />} <br />
        <input onBlur={handleBlur} type="text" name="email" placeholder="Your email" />
        <br />
        <input onBlur={handleBlur} type="password" name="password" placeholder="Your password" />
        <br />
        <input type="submit" value="SUBMIT" />
      </form>
      <p style={{ color: 'red' }} >{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }} >Account {newUser ? "created" : "loggedIn"} successfully</p>
      }
    </div>
  );
}

export default App;
