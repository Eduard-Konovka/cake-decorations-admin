import React from 'react';
import PropTypes from 'prop-types';
import s from './Wave.module.css';

export default function Wave({ text, size = 5, color = 'black' }) {
  const textArray = text.split('');

  return (
    <div className={s.box} style={{ fontSize: `${size}vw` }}>
      {textArray.map((word, i) => (
        <span
          key={word + i}
          className={s[color]}
          // eslint-disable-next-line no-useless-computed-key
          style={{ ['--i']: i, minWidth: `${size / 5}vw` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

Wave.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.oneOf(['black', 'white', 'red', 'blue', 'green', 'gray']),
};
