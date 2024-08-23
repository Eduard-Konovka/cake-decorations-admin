import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Links.module.css';

export default function Links({ links, boxStyles, linkStyles }) {
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
  links: PropTypes.array.isRequired,
  boxStyles: PropTypes.string,
  linkStyles: PropTypes.string,
};
