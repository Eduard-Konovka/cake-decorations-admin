import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth } from 'db';

export default function PrivateRoute({ children }) {
  return auth.currentUser ? children : <Navigate to="/signin" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
