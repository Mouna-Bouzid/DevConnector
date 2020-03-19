import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Landing from './components/Layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store'
import Alert from './components/Layout/Alert'

const App = () => (
  <Provider store={store}>
  <Router>
  <Fragment className='App'>
    <Navbar />
    <Route exact path="/" component={Landing} />
    <section className='container'>
      <Alert/>
    <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            {/* <Route component={Routes} /> */}
    </Switch>
    </section>
  </Fragment>
  </Router>
  </Provider>
);

export default App;
