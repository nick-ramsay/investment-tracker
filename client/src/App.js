import React, { } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import CreateAccountRequest from './pages/CreateAccountRequest/CreateAccountRequest';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Error from './pages/Error/Error';
import NoAccess from './pages/NoAccess/NoAccess';

var client = {
  user_id: "",
  session_token: "",
  auth_expiry: ""
}

function App() {
    if (client.user_id && client.session_token) {
      return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/create-account-request" component={CreateAccountRequest} />
              <Route exact path="/create-account" component={CreateAccount} />
              <Route exact path="/" component={Home} />
              <Route component={Error} />
            </Switch>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/create-account-request" component={CreateAccountRequest} />
              <Route exact path="/create-account" component={CreateAccount} />
              <Route component={NoAccess} />
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
