import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import s from './Confirm.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Confirm({ callBack, closeConfirm }) {
  const [confirmFading, setConfirmFading] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const onCloseConfirm = useCallback(() => {
    setConfirmFading(true);

    setTimeout(() => {
      closeConfirm();
      setConfirmFading(false);
    }, 450);
  }, [closeConfirm]);

  const onBackdropClick = e => e.target === e.currentTarget && onCloseConfirm();
  const onEscapePress = useCallback(
    e => e.code === 'Escape' && onCloseConfirm(),
    [onCloseConfirm],
  );

  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  }, [onEscapePress]);

  return createPortal(
    <div
      className={confirmFading ? s.backdropFading : s.backdropEmergence}
      onClick={onBackdropClick}
    >
      <div className={confirmFading ? s.contentFading : s.contentEmergence}>
        <h2>Ви дійсно хочете видалити цей товар?</h2>

        <div className={s.buttonBox}>
          <Button
            title={languageDeterminer(
              LANGUAGE.productViews.cancelDeleteButton.title,
            )}
            type="button"
            styles={s.btn}
            onClick={onCloseConfirm}
          >
            {languageDeterminer(LANGUAGE.productViews.cancelDeleteButton.text)}
          </Button>

          <Button
            title={languageDeterminer(LANGUAGE.productViews.deleteButton.title)}
            type="button"
            styles={s.btn}
            onClick={callBack}
          >
            {languageDeterminer(LANGUAGE.productViews.deleteButton.text)}
          </Button>
        </div>

        <Button
          title={languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)}
          type="button"
          typeForm="icon"
          styles={s.iconCloseBtn}
          onClick={onCloseConfirm}
        >
          <svg className={s.icon}>
            <use href={`${icons}#icon-close`}></use>
          </svg>
        </Button>
      </div>
    </div>,
    modalRoot,
  );
}

Confirm.propTypes = {
  callBack: PropTypes.func.isRequired,
  closeConfirm: PropTypes.func.isRequired,
};
