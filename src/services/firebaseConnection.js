import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyDk1j3citbcmRyWsuvDDMBz8C7YSwBl-nY",
    authDomain: "meuapp-7a7e5.firebaseapp.com",
    databaseURL: "https://meuapp-7a7e5-default-rtdb.firebaseio.com",
    projectId: "meuapp-7a7e5",
    storageBucket: "meuapp-7a7e5.appspot.com",
    messagingSenderId: "892446189856",
    appId: "1:892446189856:web:b6086ac1b2fae463cb8f45",
    measurementId: "G-KP5YFEG2MC"
};
  
// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;

    

  
  