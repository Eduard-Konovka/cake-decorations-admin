import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CountForm, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './SelectedProduct.module.css';

export default function SelectedProduct({
  selectedProduct,
  changeSelectCount,
  onDeleteProduct,
}) {
  const { _id, images, title, price, count } = selectedProduct;

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <article className={s.card}>
      <Link
        to={`/products/${_id}`}
        title={`${languageDeterminer(
          LANGUAGE.selectedProduct.titleLink,
        )} "${title}"`}
        className={s.thumb}
      >
        <img
          src={images?.length > 0 ? images[0].url : defaultImage}
          alt={title}
          className={s.image}
        />

        <h3 className={s.title}>
          {title.length < GLOBAL.titleLength
            ? title
            : title.slice(0, GLOBAL.titleLength) + '...'}
        </h3>
      </Link>

      <div className={s.controls}>
        <p className={s.price}>
          <span className={s.priceTitle}>
            {languageDeterminer(LANGUAGE.selectedProduct.price)}
          </span>
          <span className={s.priceValue}>{price} ₴</span>
        </p>

        <CountForm
          value={count}
          min={GLOBAL.productCount.min}
          max={GLOBAL.productCount.max}
          styles={{
            formStyle: s.countForm,
            labelStyle: s.countLabel,
            inputStyle: s.countInput,
          }}
          setCount={count => changeSelectCount({ count, _id })}
        />

        <Button
          title={languageDeterminer(LANGUAGE.selectedProduct.buttonTitle)}
          type="button"
          styles={s.btn}
          onClick={onDeleteProduct}
        >
          {languageDeterminer(LANGUAGE.selectedProduct.buttonText)}
        </Button>
      </div>
    </article>
  );
}

SelectedProduct.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
