import React, {Suspense} from 'react';

//ROUTING IMPORTS
import {Route, BrowserRouter as Router, Switch } from 'react-router-dom';

//COMPONENT IMPORTS FOR ROUTING
import LoginPage from './components/login/LoginPage';
import ProfilePage from './components/profile/ProfilePage';
import NotFound from "./components/NotFound"

function App() {
  return (
    <div className="App">
      {/* import fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro"></link>
      <Router>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/profile/:userId" component={ProfilePage} />
            <Route component={NotFound} />
            {/* <Route path="/about" component={AboutPage} /> */}
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
