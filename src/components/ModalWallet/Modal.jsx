import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icons from 'assets/sprite.svg';
import s from './Modal.module.css';

// import { closeModalWindow } from 'redux/index';
// import { useDispatch } from 'react-redux';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ children }) {
  // const dispatch = useDispatch();

  const onModalClose = e => {
    // dispatch(closeModalWindow());
    console.log('onModalClose');
  };

  const onEscapePress = e => {
    return e.code !== 'Escape' ? null : onModalClose();
  };

  const onBackdropClick = e => {
    return e.target !== e.currentTarget ? null : onModalClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);
    return () => window.removeEventListener('keydown', onEscapePress);
  });

  return createPortal(
    <div className={s.lightbox}>
      <div className={s.lightbox__overlay} onClick={onBackdropClick}></div>
      <div className={s.lightbox__content}>
        <button
          type="button"
          className={s.lightbox__buttonClose}
          onClick={onModalClose}
          aria-label="close Modal Window"
        >
          <svg className={s.icon} width="24" height="24">
            <use href={`${Icons}#icon-close-cross`}></use>
          </svg>
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  children: PropTypes.object.isRequired,
};
