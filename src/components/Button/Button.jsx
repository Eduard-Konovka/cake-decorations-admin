import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import iconStyle from './Icon.module.css';
import signinStyle from './SignIn.module.css';
import commonStyle from './Common.module.css';

export default function Button({
  title,
  type,
  typeForm,
  disabled,
  styles,
  onClick,
  children,
  ...allyProps
}) {
  return (
    <button
      title={title}
      type={type}
      disabled={disabled}
      className={classNames(
        typeForm === 'icon'
          ? iconStyle.btn
          : typeForm === 'signin'
          ? signinStyle.btn
          : commonStyle.btn,
        styles,
      )}
      onClick={onClick}
      {...allyProps}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  title: null,
  type: 'button',
  typeForm: 'common',
  disabled: false,
  styles: null,
  children: null,
  onClick: () => null,
};

Button.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  typeForm: PropTypes.oneOf(['common', 'signin', 'icon']),
  disabled: PropTypes.bool,
  styles: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  'aria-label': PropTypes.string,
};
