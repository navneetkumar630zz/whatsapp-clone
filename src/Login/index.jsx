import db, { auth, provider } from "../firebase";
import "./style.css";

function Login() {
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then(result => {
        db.collection("users").doc(result.user.uid).set(
          {
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          },
          { merge: true }
        );
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className='login'>
      <div className='logo'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png'
          alt='whatsapp logo'
        />
      </div>
      <h1>Sign in to Whatsapp</h1>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}

export default Login;
