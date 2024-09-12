import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { pageUp } from 'functions';
import sound from 'assets/glassBreak.mp3';
import s from './NotFoundView.module.css';

export default function NotFoundView({ message }) {
  const { mainHeight } = useGlobalState('global');

  useEffect(pageUp, []);

  useEffect(() => {
    new Audio(sound).play();
  }, []);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }} role="alert">
      <p className={s.text}>{message}</p>
    </main>
  );
}

NotFoundView.propTypes = {
  message: PropTypes.string.isRequired,
};
