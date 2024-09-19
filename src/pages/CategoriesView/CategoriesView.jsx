import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateProducts } from 'state';
import { fetchCategories, fetchProducts } from 'api';
import { Spinner, Blank, Button, CategoriesList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import imageBlank from 'assets/shop.jpg';
import s from './CategoriesView.module.css';

export default function CategoriesView({ setProductsByCategory }) {
  const { mainHeight, products } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(0);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    window.onscroll = () =>
      setScrolledTop(
        document.body.scrollTop || document.documentElement.scrollTop,
      );
  }, []);

  useEffect(() => {
    setLoading(true);

    fetchCategories()
      .then(categories => setCategories(categories))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts().then(products => {
        products.sort(
          (firstProduct, secondProduct) => firstProduct._id - secondProduct._id,
        );
        changeGlobalState(updateProducts, products);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <CategoriesList
              categories={categories}
              setProductsByCategory={setProductsByCategory}
            />
          </section>

          {scrolledTop > 300 && (
            <Button
              title={languageDeterminer(LANGUAGE.specificProductView.up)}
              type="button"
              typeForm="icon"
              styles={s.iconUpBtn}
              onClick={pageUp}
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
  setProductsByCategory: PropTypes.func.isRequired,
};
