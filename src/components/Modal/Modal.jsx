import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ modalFading, onCloseModal, children }) {
  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  });

  const onBackdropClick = e => e.target === e.currentTarget && onCloseModal();
  const onEscapePress = e => e.code === 'Escape' && onCloseModal();

  return createPortal(
    <div
      className={modalFading ? s.backdropFading : s.backdropEmergence}
      onClick={onBackdropClick}
    >
      <div className={modalFading ? s.contentFading : s.contentEmergence}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onModalClose: PropTypes.func.isRequired,
};
