import React from 'react';
import PropTypes from 'prop-types';
import s from './Blank.module.css';

export default function Blank({ title, image, alt }) {
  return (
    <div className={s.blank}>
      <p className={s.title}>{title}</p>
      <img src={image} alt={alt} className={s.img} />
    </div>
  );
}

Blank.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  alt: PropTypes.string.isRequired,
};
