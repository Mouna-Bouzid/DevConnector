import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Landing from './components/Layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

const App = () => (
  <Router>
  <Fragment className='App'>
    <Navbar />
    <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            {/* <Route component={Routes} /> */}
          </Switch>
  </Fragment>
  </Router>
);

export default App;
