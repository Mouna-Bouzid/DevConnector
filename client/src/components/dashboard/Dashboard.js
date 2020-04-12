import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {getCurrentProfile} from '../../actions/profile'
import Spinner from '../Layout/Spinner'

const Dashboard = ({profile:{ profile, loading}, getCurrentProfile, auth:{user}}) => {
  useEffect(()=>{
    getCurrentProfile()
  }, []);
  return profile && loading ===null ? <Spinner /> :
  <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
    <i className="fas fa-user"></i> Welcome {user && user.name}</p>
    {profile !== null? <Fragment>has</Fragment> : <Fragment>has not</Fragment>}
  </Fragment>;
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps= state =>({
  profile: state.profile,
  auth: state.auth
})
export default connect(mapStateToProps, {getCurrentProfile}) (Dashboard);
