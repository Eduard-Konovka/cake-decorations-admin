import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { pageUp } from 'functions';
import s from './AboutView.module.css';

export default function AboutView({ text }) {
  const { mainHeight } = useGlobalState('global');

  useEffect(pageUp, []);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {`Тут буде сторінка "${text}"!`}
    </main>
  );
}

AboutView.propTypes = {
  text: PropTypes.string.isRequired,
};
