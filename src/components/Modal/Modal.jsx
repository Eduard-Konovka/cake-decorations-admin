import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ children, onModalClose }) {
  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  });

  const onBackdropClick = e => e.target === e.currentTarget && onModalClose();
  const onEscapePress = e => e.code === 'Escape' && onModalClose();

  return createPortal(
    <div className={s.backdrop} onClick={onBackdropClick}>
      <div className={s.content}>{children}</div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onModalClose: PropTypes.func.isRequired,
};
