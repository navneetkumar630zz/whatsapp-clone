import { auth, provider } from "../firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import "./style.css";

function Login() {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <div className='login'>
        <div className='login__container'>
          <div className='logo'>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png'
              alt='whatsapp logo'
            />
          </div>
          <h1>Sign in to Whatsapp</h1>
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
