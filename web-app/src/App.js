import React, {lazy, Suspense} from 'react';

//ROUTING IMPORTS
import {Route, BrowserRouter as Router, Switch } from 'react-router-dom';


//COMPONENT IMPORTS FOR ROUTING
import LoginPage from './components/login/LoginPage';
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/profile" component={ProfilePage} />
              {/* <Route path="/about" component={AboutPage} />
              <Route component={Notfound} /> */}
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
