import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Swiper } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import Icons from 'assets/icons.svg';
import imageNotFound from 'assets/notFound.png';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ product, mainImageIdx, closeModal }) {
  const [modalImageIdx, setModalImageIdx] = useState(mainImageIdx);
  const [modalFading, setModalFading] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const onCloseModal = useCallback(() => {
    setModalFading(true);

    setTimeout(() => {
      closeModal();
      setModalFading(false);
    }, 450);
  }, [closeModal]);

  const onRightHandler = () => {
    setModalImageIdx(
      modalImageIdx !== product?.images?.length - 1 ? modalImageIdx + 1 : 0,
    );
  };

  const onLeftHandler = () => {
    setModalImageIdx(
      modalImageIdx !== 0 ? modalImageIdx - 1 : product?.images?.length - 1,
    );
  };

  const onBackdropClick = e => e.target === e.currentTarget && onCloseModal();
  const onEscapePress = useCallback(
    e => e.code === 'Escape' && onCloseModal(),
    [onCloseModal],
  );

  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  }, [onEscapePress]);

  return createPortal(
    <div
      className={modalFading ? s.backdropFading : s.backdropEmergence}
      onClick={onBackdropClick}
    >
      <div className={modalFading ? s.contentFading : s.contentEmergence}>
        <Swiper onRight={onLeftHandler} onLeft={onRightHandler}>
          <img
            src={
              product?.images?.length > 0
                ? product.images[modalImageIdx]
                : imageNotFound
            }
            alt={product.title}
            className={s.modalImage}
          />
        </Swiper>

        <Button
          title={languageDeterminer(
            LANGUAGE.specificProductView.сollapseButtonTitle,
          )}
          type="button"
          typeForm="icon"
          styles={s.iconCloseBtn}
          onClick={onCloseModal}
        >
          <svg className={s.icon}>
            <use href={`${Icons}#icon-close`}></use>
          </svg>
        </Button>

        {product?.images?.length > 1 && (
          <>
            <Button
              title={languageDeterminer(LANGUAGE.specificProductView.right)}
              type="button"
              typeForm="icon"
              styles={s.iconRightBtn}
              onClick={onRightHandler}
            >
              <svg className={s.arrow}>
                <use href={`${Icons}#icon-arrow-right`}></use>
              </svg>
            </Button>

            <Button
              title={languageDeterminer(LANGUAGE.specificProductView.left)}
              type="button"
              typeForm="icon"
              styles={s.iconLeftBtn}
              onClick={onLeftHandler}
            >
              <svg className={s.arrow}>
                <use href={`${Icons}#icon-arrow-left`}></use>
              </svg>
            </Button>
          </>
        )}
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  product: PropTypes.object.isRequired,
  mainImageIdx: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
};
