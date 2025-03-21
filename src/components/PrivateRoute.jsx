import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  authStateChangeUser,
} from 'state';
import { saveProfileToDatabase } from 'functions';

// - If the route is private and the user is logged in, render the component
// - Otherwise redirects to "redirectTo"

export default function PrivateRoute({ children, redirectTo = '/' }) {
  const { stateChange } = useGlobalState('auth');
  const changeGlobalState = useChangeGlobalState();

  stateChange && saveProfileToDatabase();

  useEffect(() => {
    changeGlobalState(authStateChangeUser);
  }, [changeGlobalState]);

  return stateChange ? children : <Navigate to={redirectTo} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string,
};
