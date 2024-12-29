import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import s from './Alert.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Alert({ callBack, closeAlert }) {
  const [alertFading, setAlertFading] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const onCloseAlert = useCallback(() => {
    setAlertFading(true);

    setTimeout(() => {
      closeAlert();
      setAlertFading(false);
    }, 450);
  }, [closeAlert]);

  const onBackdropClick = e => e.target === e.currentTarget && onCloseAlert();
  const onEscapePress = useCallback(
    e => e.code === 'Escape' && onCloseAlert(),
    [onCloseAlert],
  );

  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  }, [onEscapePress]);

  return createPortal(
    <div
      className={alertFading ? s.backdropFading : s.backdropEmergence}
      onClick={onBackdropClick}
    >
      <div className={alertFading ? s.contentFading : s.contentEmergence}>
        <h2>Ви дійсно хочете видалити цей товар?</h2>

        <div className={s.buttonBox}>
          <Button
            title={languageDeterminer(
              LANGUAGE.productViews.cancelDeleteButton.title,
            )}
            type="button"
            styles={s.btn}
            onClick={onCloseAlert}
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
          onClick={onCloseAlert}
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

Alert.propTypes = {
  callBack: PropTypes.func.isRequired,
  closeAlert: PropTypes.func.isRequired,
};
