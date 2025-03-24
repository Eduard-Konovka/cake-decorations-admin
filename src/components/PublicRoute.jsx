import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth } from 'db';

export default function PublicRoute({ children, restricted = false }) {
  const shouldRedirect = auth.currentUser && restricted;
  return !shouldRedirect ? children : <Navigate replace to="/categories" />;
}

PublicRoute.propTypes = {
  children: PropTypes.element.isRequired,
  restricted: PropTypes.bool,
};
