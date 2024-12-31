import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateProducts } from 'state';
import { fetchProducts } from 'api';
import { Spinner, Blank, Button, OptionList, ProductList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { ReactComponent as SearchIcon } from 'assets/search.svg';
import icons from 'assets/icons.svg';
import imageBlank from 'assets/shop.jpg';
import s from './ProductsView.module.css';

export default function ProductsView({ productsByCategoryOrTag }) {
  const { mainHeight, products } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(0);
  const [error, setError] = useState(null);
  const [productsByName, setProductsByName] = useState([]);
  const [productsByPrice, setProductsByPrice] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [ordinalOfDozen, setOrdinalOfDozen] = useState(0);
  const [dozensOfProducts, setDozensOfProducts] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);
  const [lastTarget, setLastTarget] = useState(null);
  const [firstTarget, setFirstTarget] = useState(null);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    window.onscroll = () =>
      setScrolledTop(
        document.body.scrollTop || document.documentElement.scrollTop,
      );
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);

      fetchProducts()
        .then(products => {
          products.sort(
            (firstProduct, secondProduct) =>
              secondProduct._id - firstProduct._id,
          );
          changeGlobalState(updateProducts, products);
          setProductsByName(products);
          setProductsByPrice(products);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    } else if (productsByCategoryOrTag.length !== 0) {
      setProductsByName(productsByCategoryOrTag);
      setProductsByPrice(products);
    } else {
      setProductsByName(products);
      setProductsByPrice(products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const difference = productsByName.filter(product =>
      productsByPrice.includes(product),
    );

    setVisibleProducts(difference);
    setOrdinalOfDozen(1);
  }, [productsByName, productsByPrice]);

  useEffect(() => {
    const productsByDozens = visibleProducts.slice(
      (ordinalOfDozen - 1) * GLOBAL.dozen,
      (ordinalOfDozen + 1) * GLOBAL.dozen,
    );

    setDozensOfProducts(productsByDozens);
  }, [visibleProducts, ordinalOfDozen]);

  useEffect(() => {
    setOptionList(true);
  }, [optionList]);

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  useEffect(() => {
    const firstObserverCallback = (entries, firstObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          firstObserver.unobserve(firstTarget);
          setOrdinalOfDozen(prev => prev - 1);
        }
      });
    };

    const firstObserver = new IntersectionObserver(
      firstObserverCallback,
      observerOptions,
    );

    firstTarget &&
      ordinalOfDozen > 1 &&
      visibleProducts.length > GLOBAL.dozen &&
      firstObserver.observe(firstTarget);

    return () => {
      firstTarget && firstObserver.unobserve(firstTarget);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTarget]);

  useEffect(() => {
    const lastObserverCallback = (entries, lastObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lastObserver.unobserve(lastTarget);
          setOrdinalOfDozen(prev => prev + 1);
        }
      });
    };

    const lastObserver = new IntersectionObserver(
      lastObserverCallback,
      observerOptions,
    );

    lastTarget &&
      ordinalOfDozen < Math.floor(products.length / GLOBAL.dozen) &&
      visibleProducts.length > GLOBAL.dozen &&
      lastObserver.observe(lastTarget);

    return () => {
      lastTarget && lastObserver.unobserve(lastTarget);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTarget]);

  setTimeout(() => {
    setFirstTarget(document.getElementById('productList')?.firstElementChild);
    setLastTarget(document.getElementById('productList')?.lastElementChild);
  }, 250);

  function handleKeyPress(event) {
    if (event.charCode === GLOBAL.keyСodes.enter) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    setSearchByName(event.target.value);
  }

  function handleNameClick() {
    const visibleProductsToLowerCase = products.map(product => ({
      ...product,
      title: product.title.toLowerCase(),
    }));

    const queryArr = searchByName
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const targetProductsToLowerCase = visibleProductsToLowerCase.filter(
      product => {
        let result = !product;

        for (let i = 0; i < queryArr.length; i++) {
          if (product.title.includes(queryArr[i])) {
            result = product;
          }
        }

        return result;
      },
    );

    const productIds = targetProductsToLowerCase.map(
      productToLowerCase => productToLowerCase._id,
    );

    const targetProducts = products.filter(product =>
      productIds.includes(product._id),
    );

    if (!searchByName) {
      setProductsByName(products);
    } else if (targetProducts.length > 0) {
      setProductsByName(targetProducts);
    } else {
      toast.error(languageDeterminer(LANGUAGE.searchByName.error));
      setProductsByName([]);
    }
  }

  function handlePriceChange(event) {
    switch (event.target.value) {
      case 'allPrices':
        setProductsByPrice(products);
        break;

      case `${GLOBAL.pricesBreakPoint.min}>`:
        setProductsByPrice(
          products.filter(
            product =>
              product.price > GLOBAL.pricesBreakPoint.min &&
              product.price <= GLOBAL.pricesBreakPoint.first,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.first}>`:
        setProductsByPrice(
          products.filter(
            product =>
              product.price > GLOBAL.pricesBreakPoint.first &&
              product.price <= GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.second}>`:
        setProductsByPrice(
          products.filter(
            product => product.price > GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      default:
        setProductsByPrice(
          products.filter(
            product => product.price === Number(event.target.value),
          ),
        );
        break;
    }
  }

  function handleSort(event) {
    const value = event.target.value;

    const ascendingDate = [...visibleProducts].sort(
      (firstProduct, secondProduct) => firstProduct._id - secondProduct._id,
    );
    const descendingDate = [...visibleProducts].sort(
      (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
    );
    const ascendingPrice = [...visibleProducts].sort(
      (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
    );
    const descendingPrice = [...visibleProducts].sort(
      (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
    );

    switch (value) {
      case 'ascendingDate':
        setVisibleProducts(ascendingDate);
        setOrdinalOfDozen(1);
        break;

      case 'descendingDate':
        setVisibleProducts(descendingDate);
        setOrdinalOfDozen(1);
        break;

      case 'ascendingPrice':
        setVisibleProducts(ascendingPrice);
        setOrdinalOfDozen(1);
        break;

      case 'descendingPrice':
        setVisibleProducts(descendingPrice);
        setOrdinalOfDozen(1);
        break;

      default:
        setVisibleProducts(descendingDate);
        setOrdinalOfDozen(1);
        break;
    }
  }

  function reset() {
    setSearchByName('');
    setOptionList(false);
    setProductsByName(products);
    setProductsByPrice(products);
    setOrdinalOfDozen(1);
  }

  function upHandler() {
    setOrdinalOfDozen(1);

    setTimeout(pageUp, 100);
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

      {!loading && !error && products.length === 0 && (
        <Blank
          title={languageDeterminer(LANGUAGE.noProducts)}
          image={imageBlank}
          alt={languageDeterminer(LANGUAGE.openShopAlt)}
        />
      )}

      {products.length > 0 && (
        <>
          <section className={s.bars}>
            <form className={s.searchBar}>
              <div className={s.searchByName}>
                <input
                  name={languageDeterminer(LANGUAGE.searchByName.title)}
                  type="text"
                  placeholder={languageDeterminer(LANGUAGE.searchByName.title)}
                  value={searchByName}
                  className={s.inputByName}
                  onKeyPress={handleKeyPress}
                  onChange={handleChange}
                />

                <Button
                  title={languageDeterminer(LANGUAGE.searchByName.title)}
                  type="button"
                  typeForm="icon"
                  aria-label={languageDeterminer(LANGUAGE.searchByName.title)}
                  styles={s.iconButton}
                  onClick={handleNameClick}
                >
                  <SearchIcon />
                </Button>
              </div>

              <select
                id="inputByPrice"
                name="inputByPrice"
                className={s.inputByPrice}
                onChange={handlePriceChange}
              >
                {optionList && <OptionList products={products} />}
              </select>

              <Button
                title={languageDeterminer(LANGUAGE.resetFiltersButton.title)}
                type="button"
                styles={s.btn}
                onClick={reset}
              >
                {languageDeterminer(LANGUAGE.resetFiltersButton.text)}
              </Button>
            </form>

            <form className={s.sortBar}>
              <label htmlFor="inputBySort" className={s.sortLabel}>
                {languageDeterminer(LANGUAGE.sortBy.label)}
              </label>

              <select
                id="inputBySort"
                name="inputBySort"
                className={s.inputBySort}
                defaultValue={'descendingDate'}
                onChange={handleSort}
              >
                <option value={'ascendingPrice'}>
                  {languageDeterminer(LANGUAGE.sortBy.ascendingPrice)}
                </option>
                <option value={'descendingPrice'}>
                  {languageDeterminer(LANGUAGE.sortBy.descendingPrice)}
                </option>
                <option value={'ascendingDate'}>
                  {languageDeterminer(LANGUAGE.sortBy.ascendingDate)}
                </option>
                <option value={'descendingDate'}>
                  {languageDeterminer(LANGUAGE.sortBy.descendingDate)}
                </option>
              </select>
            </form>

            <form className={s.sortBar}>
              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                styles={s.btn}
              >
                <Link to="/products/new" className={s.btnLink}>
                  {languageDeterminer(LANGUAGE.addProductButton.text)}
                </Link>
              </Button>
            </form>
          </section>

          <section className={s.productList}>
            <ProductList products={dozensOfProducts} />
          </section>

          {scrolledTop > 300 && (
            <Button
              title={languageDeterminer(LANGUAGE.productViews.up)}
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

ProductsView.propTypes = {
  productsByCategoryOrTag: PropTypes.array.isRequired,
};
