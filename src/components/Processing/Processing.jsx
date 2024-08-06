import React from 'react';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import gears from 'assets/gears.gif';
import imageProcessing from 'assets/processing.png';
import s from './Processing.module.css';

export default function Processing() {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <div className={s.processing}>
      <p className={s.title}>{languageDeterminer(LANGUAGE.processing.title)}</p>
      <div className={s.imageBox}>
        <img
          src={gears}
          alt={languageDeterminer(LANGUAGE.processing.gearsAlt)}
          className={s.gears}
        />
        <img
          src={imageProcessing}
          alt={languageDeterminer(LANGUAGE.processing.processingAlt)}
        />
      </div>
    </div>
  );
}
