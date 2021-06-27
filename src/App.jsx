import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import db, { auth } from "./firebase";
import { actionTypes } from "./reducer";
import Loader from "./Loader";
import Login from "./Login";
import Sidebar from "./Sidebar";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // the user just logged in or was logged in
        db.collection("users")
          .doc(authUser.uid)
          .get()
          .then(snapshot => {
            dispatch({
              type: actionTypes.SET_USER,
              user: { id: snapshot.id, ...snapshot.data() },
            });
            setLoading(false);
          });
      } else {
        // the user is logged out
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='App'>
      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
          <Router>
            <Switch>
              <Route path='/:type/:id'>
                <Chat />
              </Route>
            </Switch>
            <Sidebar />
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
