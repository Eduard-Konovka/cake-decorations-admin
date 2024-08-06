import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { getTags, getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { TAMPLATES, LANGUAGE } from 'constants';
import s from './Tags.module.css';

export default function Tags({ title, styles, setProductsByTag }) {
  const { products } = useGlobalState('global');
  const tags = getTags(title.toLowerCase(), TAMPLATES.tags);
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  function handleTagClick(tag) {
    const productsTitlesToLowerCase = products.map(product => ({
      ...product,
      title: product.title.toLowerCase(),
    }));

    const targetProductsToLowerCase = productsTitlesToLowerCase.filter(
      product => product.title.includes(tag),
    );

    const productIds = targetProductsToLowerCase.map(product => product._id);

    const targetProducts = products.filter(product =>
      productIds.includes(product._id),
    );

    setProductsByTag(targetProducts);
  }

  return tags.map(tag => (
    <Link
      key={tag}
      to="/products"
      title={`${languageDeterminer(LANGUAGE.tags)} "${tag}"`}
      className={classNames(s.tag, styles)}
      onClick={() => handleTagClick(tag)}
    >
      {tag}
    </Link>
  ));
}

Tags.propTypes = {
  title: PropTypes.string.isRequired,
  styles: PropTypes.string,
  setProductsByTag: PropTypes.func.isRequired,
};
