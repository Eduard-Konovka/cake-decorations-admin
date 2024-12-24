import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';

// - If the route is private and the user is logged in, render the component
// - Otherwise redirects to "redirectTo"

export default function PrivateRoute({ children, redirectTo = '/' }) {
  const { user } = useGlobalState('global');

  return user.name ? children : <Navigate to={redirectTo} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string,
};
