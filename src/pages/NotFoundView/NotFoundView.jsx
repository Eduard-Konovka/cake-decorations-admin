import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { Button } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import sound from 'assets/glassBreak.mp3';
import s from './NotFoundView.module.css';

export default function NotFoundView({ message }) {
  const { mainHeight } = useGlobalState('global');
  const [audio] = useState(new Audio(sound));

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    const playSound = () => {
      audio.play();
      document.removeEventListener('click', playSound);
    };

    document.addEventListener('click', playSound);

    return () => document.removeEventListener('click', playSound);
  }, [audio]);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }} role="alert">
      <Button
        title={languageDeterminer(LANGUAGE.notFoundView.redirect.title)}
        type="button"
        styles={s.btn}
      >
        <Link to="/" className={s.btnLink}>
          {languageDeterminer(LANGUAGE.notFoundView.redirect.text)}
        </Link>
      </Button>

      <p className={s.text}>{message}</p>
    </main>
  );
}

NotFoundView.propTypes = {
  message: PropTypes.string.isRequired,
};
