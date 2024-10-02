import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { pageUp } from 'functions';
import s from './AboutView.module.css';

export default function AboutView({ text, wave }) {
  const { mainHeight } = useGlobalState('global');

  const textArray = ['"', ...text.split(''), '"'];

  useEffect(pageUp, []);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <div className={s.title}>Тут буде сторінка</div>
      <div className={s.box}>
        {wave
          ? textArray.map((word, i) => (
              <span
                key={word + i}
                className={s.wave}
                // eslint-disable-next-line no-useless-computed-key
                style={{ ['--i']: i + 1, minWidth: `1vw` }}
              >
                {word}
              </span>
            ))
          : `"${text}"`}
      </div>
    </main>
  );
}

AboutView.propTypes = {
  text: PropTypes.string.isRequired,
  wave: PropTypes.bool,
};
