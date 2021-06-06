import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import { auth } from "./firebase";
import Login from "./Login";
import Sidebar from "./Sidebar";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // the user just logged in or was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <div className='App'>
      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
          <Router>
            <Switch>
              <Route path='/room/:roomId'>
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
