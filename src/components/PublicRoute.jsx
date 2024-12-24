import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';

// - If the route is restricted and the user is logged in, redirects to "redirectTo"
// - Otherwise renders the component

export default function PublicRoute({
  children,
  restricted = false,
  redirectTo = '/',
}) {
  const { user } = useGlobalState('global');

  const shouldRedirect = user.name && restricted;
  return shouldRedirect ? <Navigate to={redirectTo} /> : children;
}

PublicRoute.propTypes = {
  children: PropTypes.element.isRequired,
  restricted: PropTypes.bool,
  redirectTo: PropTypes.string,
};
