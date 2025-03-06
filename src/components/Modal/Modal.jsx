import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { Button, Swiper } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper, titleWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import imageNotFound from 'assets/notFound.png';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ product, mainImageIdx, closeModal }) {
  const { language } = useGlobalState('global');

  const [modalImageIdx, setModalImageIdx] = useState(mainImageIdx);
  const [modalFading, setModalFading] = useState(false);
  const [startLeftAnimationX, setStartLeftAnimationX] = useState(false);
  const [startRightAnimationX, setStartRightAnimationX] = useState(false);
  const [finishLeftAnimationX, setFinishLeftAnimationX] = useState(false);
  const [finishRightAnimationX, setFinishRightAnimationX] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const onCloseModal = useCallback(() => {
    setModalFading(true);

    setTimeout(() => {
      closeModal();
      setModalFading(false);
    }, 450);
  }, [closeModal]);

  const onLeftHandler = () => {
    setFinishLeftAnimationX(true);

    setTimeout(() => {
      setFinishLeftAnimationX(false);
      setModalImageIdx(
        modalImageIdx !== 0 ? modalImageIdx - 1 : product?.images?.length - 1,
      );
      setStartLeftAnimationX(true);
    }, 500);

    setTimeout(() => {
      setStartLeftAnimationX(false);
    }, 1000);
  };

  const onRightHandler = () => {
    setFinishRightAnimationX(true);

    setTimeout(() => {
      setFinishRightAnimationX(false);
      setModalImageIdx(
        modalImageIdx !== product?.images?.length - 1 ? modalImageIdx + 1 : 0,
      );
      setStartRightAnimationX(true);
    }, 500);

    setTimeout(() => {
      setStartRightAnimationX(false);
    }, 1000);
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
                ? product.images[modalImageIdx].url
                : imageNotFound
            }
            alt={titleWrapper(language, product)}
            className={
              startLeftAnimationX
                ? s.onStartLeftTranslateAnimationX
                : startRightAnimationX
                ? s.onStartRightTranslateAnimationX
                : finishLeftAnimationX
                ? s.onFinishLeftTranslateAnimationX
                : finishRightAnimationX
                ? s.onFinishRightTranslateAnimationX
                : s.modalImage
            }
          />
        </Swiper>

        <Button
          title={languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)}
          type="button"
          typeForm="icon"
          styles={s.iconCloseBtn}
          onClick={onCloseModal}
        >
          <svg className={s.icon}>
            <use href={`${icons}#icon-close`}></use>
          </svg>
        </Button>

        {product?.images?.length > 1 && (
          <>
            <Button
              title={languageDeterminer(LANGUAGE.productViews.right)}
              type="button"
              typeForm="icon"
              styles={s.iconRightBtn}
              onClick={onRightHandler}
            >
              <svg className={s.arrow}>
                <use href={`${icons}#icon-arrow-right`}></use>
              </svg>
            </Button>

            <Button
              title={languageDeterminer(LANGUAGE.productViews.left)}
              type="button"
              typeForm="icon"
              styles={s.iconLeftBtn}
              onClick={onLeftHandler}
            >
              <svg className={s.arrow}>
                <use href={`${icons}#icon-arrow-left`}></use>
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
  product: PropTypes.shape({
    title: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  }).isRequired,
  mainImageIdx: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
};
