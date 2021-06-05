import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDT-TSQrBWiwe8cA46B04gtYtU7dzFh6t0",
  authDomain: "whatsapp-2021.firebaseapp.com",
  projectId: "whatsapp-2021",
  storageBucket: "whatsapp-2021.appspot.com",
  messagingSenderId: "726343059988",
  appId: "1:726343059988:web:4ceef89b45c323813df501",
  measurementId: "G-85LYDBNVWM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
