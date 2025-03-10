import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { getLanguage, getPureArr } from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Tags.module.css';

export default function Tags({ tags, boxStyles, tagStyles, setProductsByTag }) {
  const { language, products } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  function handleTagClick(tagQueries) {
    const lowerCaseTitlesProducts = products.map(product => ({
      lowerCaseProductId: product._id,
      lowerCaseTitle: propertyWrapper(language, product, 'title').toLowerCase(),
    }));

    const pureTitlesProducts = lowerCaseTitlesProducts.map(obj => {
      const titleArr = obj.lowerCaseTitle.split(' ');
      const titlePureArr = getPureArr(titleArr);

      return { ...obj, pureTitle: titlePureArr.join(' ') };
    });

    const targetProductsIds = [];
    tagQueries.forEach(query => {
      const lowerCaseTargetProducts = pureTitlesProducts.filter(
        product =>
          new RegExp(`^${query}`).test(product.pureTitle) ||
          new RegExp(` ${query}`).test(product.pureTitle) ||
          new RegExp(`-${query}`).test(product.pureTitle),
      );

      lowerCaseTargetProducts.forEach(targetProduct =>
        targetProductsIds.push(targetProduct.lowerCaseProductId),
      );
    });

    const uniqTargetProductsIds = [...new Set(targetProductsIds)];
    const targetProducts = products.filter(product =>
      uniqTargetProductsIds.includes(product._id),
    );

    setProductsByTag(targetProducts);
  }

  return tags.map(tagObj => (
    <div key={tagObj.tag} className={boxStyles}>
      <Link
        to="/products"
        title={`${languageDeterminer(LANGUAGE.tags)} "${tagObj.tag}"`}
        className={classNames(s.tag, tagStyles)}
        onClick={() => handleTagClick(tagObj.queries)}
      >
        {`#${tagObj.tag}`}
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
