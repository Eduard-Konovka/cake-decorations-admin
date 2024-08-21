import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getTags, getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { TAMPLATES, LANGUAGE } from 'constants';
import s from './Links.module.css';

export default function Links({ title, boxStyles, linkStyles }) {
  const links = getTags(title, TAMPLATES.links);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return links.map(link => (
    <div key={link} className={boxStyles}>
      <a
        title={`${languageDeterminer(LANGUAGE.links)} "${link}"`}
        href={`https://www.google.com/search?q=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(s.link, linkStyles)}
      >
        {link}
      </a>
    </div>
  ));
}

Links.propTypes = {
  title: PropTypes.string.isRequired,
  boxStyles: PropTypes.string,
  linkStyles: PropTypes.string,
};
