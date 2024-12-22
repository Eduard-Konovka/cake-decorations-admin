import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateProducts,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import { fetchCategories, fetchProducts, fetchTags, fetchLinks } from 'api';
import { Spinner, Blank, Button, CategoriesList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import icons from 'assets/icons.svg';
import imageBlank from 'assets/shop.jpg';
import s from './CategoriesView.module.css';

export default function CategoriesView({ setProductsByCategory }) {
  const { mainHeight, categories, products, tagsDictionary, linksDictionary } =
    useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(0);
  const [error, setError] = useState(null);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    window.onscroll = () =>
      setScrolledTop(
        document.body.scrollTop || document.documentElement.scrollTop,
      );
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(true);

      fetchCategories()
        .then(categories => changeGlobalState(updateCategories, categories))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
        .then(products => {
          products.sort(
            (firstProduct, secondProduct) =>
              secondProduct._id - firstProduct._id,
          );
          changeGlobalState(updateProducts, products);
        })
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingProducts,
            )}:\n${error}`,
          ),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tagsDictionary) {
      fetchTags()
        .then(tagsDictionary =>
          changeGlobalState(updateTagsDictionary, tagsDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingTags,
            )}:\n${error}`,
          ),
        );
    }

    if (!linksDictionary) {
      fetchLinks()
        .then(linksDictionary =>
          changeGlobalState(updateLinksDictionary, linksDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingLinks,
            )}:\n${error}`,
          ),
        );
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
            <CategoriesList setProductsByCategory={setProductsByCategory} />
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
