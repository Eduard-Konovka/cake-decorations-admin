import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getTags, getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { TAMPLATES, LANGUAGE } from 'constants';
import s from './Links.module.css';

export default function Links({ title, styles }) {
  const links = getTags(title, TAMPLATES.links);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return links.map(link => (
    <a
      title={`${languageDeterminer(LANGUAGE.links)} "${link}"`}
      href={`https://www.google.com/search?q=${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(s.link, styles)}
      key={link}
    >
      {link}
    </a>
  ));
}

Links.propTypes = {
  title: PropTypes.string.isRequired,
  styles: PropTypes.string,
};
