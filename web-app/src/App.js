import React from 'react';

//ROUTING IMPORTS
import {Route, BrowserRouter as Router, Switch } from 'react-router-dom';


//COMPONENT IMPORTS FOR ROUTING
import LoginPage from './components/LoginPage'
import ProfilePage from './components/ProfilePage'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/profile" component={ProfilePage} />
            {/* <Route path="/about" component={AboutPage} />
            <Route component={Notfound} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
