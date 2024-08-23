import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Tags.module.css';

export default function Tags({ tags, boxStyles, tagStyles, setProductsByTag }) {
  const { products } = useGlobalState('global');

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
    <div key={tag} className={boxStyles}>
      <Link
        to="/products"
        title={`${languageDeterminer(LANGUAGE.tags)} "${tag}"`}
        className={classNames(s.tag, tagStyles)}
        onClick={() => handleTagClick(tag)}
      >
        {`#${tag}`}
      </Link>
    </div>
  ));
}

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  boxStyles: PropTypes.string,
  tagStyles: PropTypes.string,
  setProductsByTag: PropTypes.func.isRequired,
};
