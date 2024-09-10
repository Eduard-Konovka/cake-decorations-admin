import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState } from 'state';
import { fetchProducts } from 'api';
import { Spinner, Blank, Button, CategoriesList } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import imageBlank from 'assets/shop.jpg';
import s from './CategoriesView.module.css';

export default function CategoriesView() {
  const { mainHeight } = useGlobalState('global');
  // eslint-disable-next-line
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(0);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    setLoading(true);

    fetchProducts()
      .then(products => setCategories(products.slice(0, 12)))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.onscroll = () =>
      setScrolledTop(
        document.body.scrollTop || document.documentElement.scrollTop,
      );
  }, []);

  // FIXME сделать плавную прокрутку вверх
  function upHandler() {
    setTimeout(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  }

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="red" />}

      {error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <Blank
          title={languageDeterminer(LANGUAGE.noProducts)}
          image={imageBlank}
          alt={languageDeterminer(LANGUAGE.openShopAlt)}
        />
      )}

      {categories.length > 0 && (
        <>
          <section className={s.categoriesList}>
            <CategoriesList categories={categories} />
          </section>

          {scrolledTop > 300 && (
            <Button
              title={languageDeterminer(LANGUAGE.specificProductView.up)}
              type="button"
              typeForm="icon"
              styles={s.iconUpBtn}
              onClick={upHandler}
            >
              <svg className={s.arrow}>
                <use href={`${icons}#icon-arrow-up`}></use>
              </svg>
            </Button>
          )}
        </>
      )}
    </main>
  );
}

CategoriesView.propTypes = {
  // productsByTag: PropTypes.array.isRequired,
};
