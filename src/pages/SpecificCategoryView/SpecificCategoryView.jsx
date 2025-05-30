import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateProducts } from 'state';
import { fetchCollection, changeProductsPricesApi } from 'api';
import { Spinner, Button, OptionList, ProductList } from 'components';
import { getLanguage, setScrollPosition, getSum } from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { ReactComponent as SearchIcon } from 'assets/search.svg';
import icons from 'assets/icons.svg';
import s from './SpecificCategoryView.module.css';

export default function SpecificCategoryView({ productsByCategoryOrTag }) {
  const location = useLocation();
  const { mainHeight, language, categories, products } =
    useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [scrolledTop, setScrolledTop] = useState(0);
  const [error, setError] = useState(null);
  const [countValue, setCountValue] = useState(0);
  const [priceMultiplier, setPriceMultiplier] = useState('increase');
  const [productsByName, setProductsByName] = useState([]);
  const [productsByPrice, setProductsByPrice] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);

  const categoryId = location.pathname.slice(12, location.pathname.length);
  const category = categories.find(category => category._id === categoryId);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    window.onscroll = () =>
      setScrolledTop(
        document.body.scrollTop || document.documentElement.scrollTop,
      );
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);

      fetchCollection('products')
        .then(products => {
          products.sort(
            (firstProduct, secondProduct) =>
              secondProduct._id - firstProduct._id,
          );
          changeGlobalState(updateProducts, products);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }

    setProductsByName(productsByCategoryOrTag);
    setProductsByPrice(productsByCategoryOrTag);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const difference = productsByName.filter(product =>
      productsByPrice.includes(product),
    );

    setVisibleProducts(difference);
  }, [productsByName, productsByPrice]);

  useEffect(() => {
    if (visibleProducts.length !== 0) {
      const savedPosition = sessionStorage.getItem('scrollPosition');

      if (savedPosition !== null) {
        setScrollPosition(parseInt(savedPosition, 10));
        sessionStorage.removeItem('scrollPosition');
      } else {
        setScrollPosition();
      }
    }
  }, [visibleProducts]);

  useEffect(() => {
    setOptionList(true);
  }, [optionList]);

  function handleCountKeyPress(event) {
    if (
      GLOBAL.keyСodes.prohibited.includes(event.charCode) ||
      (event.charCode === GLOBAL.keyСodes.zero && !event.target.value)
    ) {
      event.preventDefault();
    }
  }

  function handleCountChange(event) {
    const inputValue = Number(event.target.value);

    setCountValue(inputValue);
  }

  async function handleMassPriceChange() {
    const updatedProducts = [];
    products.forEach(product => {
      if (product.category === categoryId) {
        const newPrice =
          priceMultiplier === 'increase'
            ? getSum(Number(product.price), countValue)
            : getSum(
                Number(product.price),
                (Number(product.price) / 100) * countValue,
              ).toFixed(2);

        updatedProducts.push({ ...product, price: newPrice });
      }
    });

    const response = await changeProductsPricesApi(
      updatedProducts,
      propertyWrapper(language, category, 'title'),
    );

    if (response !== 'success') {
      toast.error(
        `${languageDeterminer(LANGUAGE.category.alert.dbError)}: ${response}`,
      );
      return;
    }

    fetchCollection('products')
      .then(products => {
        products.sort(
          (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
        );
        changeGlobalState(updateProducts, products);
        toast.success(languageDeterminer(LANGUAGE.category.alert.success));
      })
      .catch(error => {
        toast.error(
          `${languageDeterminer(LANGUAGE.category.alert.error)}: ${
            error.message
          }`,
        );
      })
      .finally(() => {
        setCountValue(0);
        setPriceMultiplier('increase');
        toast.info(languageDeterminer(LANGUAGE.category.alert.info));
      });
  }

  function handleKeyPress(event) {
    if (event.charCode === GLOBAL.keyСodes.enter) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    setSearchByName(event.target.value);
  }

  function handleNameClick() {
    const visibleProductsToLowerCase = productsByCategoryOrTag.map(product => ({
      ...product,
      title: {
        ua: propertyWrapper('UA', product, 'title').toLowerCase(),
        ru: propertyWrapper('RU', product, 'title').toLowerCase(),
        en: propertyWrapper('EN', product, 'title').toLowerCase(),
      },
    }));

    const queryArr = searchByName
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const targetProductsToLowerCase = visibleProductsToLowerCase.filter(
      product => {
        let result = !product;

        for (let i = 0; i < queryArr.length; i++) {
          if (product.title['ua' || 'ru' || 'en'].includes(queryArr[i])) {
            result = product;
          }
        }

        return result;
      },
    );

    const productIds = targetProductsToLowerCase.map(
      productToLowerCase => productToLowerCase._id,
    );

    const targetProducts = productsByCategoryOrTag.filter(product =>
      productIds.includes(product._id),
    );

    if (!searchByName) {
      setProductsByName(productsByCategoryOrTag);
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
        setProductsByPrice(productsByCategoryOrTag);
        break;

      case `${GLOBAL.pricesBreakPoint.min}>`:
        setProductsByPrice(
          productsByCategoryOrTag.filter(
            product =>
              product.price > GLOBAL.pricesBreakPoint.min &&
              product.price <= GLOBAL.pricesBreakPoint.first,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.first}>`:
        setProductsByPrice(
          productsByCategoryOrTag.filter(
            product =>
              product.price > GLOBAL.pricesBreakPoint.first &&
              product.price <= GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.second}>`:
        setProductsByPrice(
          productsByCategoryOrTag.filter(
            product => product.price > GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      default:
        setProductsByPrice(
          productsByCategoryOrTag.filter(
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
        break;

      case 'descendingDate':
        setVisibleProducts(descendingDate);
        break;

      case 'ascendingPrice':
        setVisibleProducts(ascendingPrice);
        break;

      case 'descendingPrice':
        setVisibleProducts(descendingPrice);
        break;

      default:
        setVisibleProducts(descendingDate);
        break;
    }
  }

  function reset() {
    setSearchByName('');
    setOptionList(false);
    setProductsByName(productsByCategoryOrTag);
    setProductsByPrice(productsByCategoryOrTag);
  }

  function upHandler() {
    requestAnimationFrame(() => setScrollPosition());
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

      {!loading && !error && (
        <>
          <section className={s.titleSection}>
            <form className={s.sortBar}>
              <h2 className={s.categoryTitle}>
                <span className={s.categoryTitleSpan}>
                  {languageDeterminer(LANGUAGE.category.title)}
                </span>

                {propertyWrapper(language, category, 'title')}
              </h2>

              <label htmlFor="count" className={s.sortLabel}>
                {languageDeterminer(LANGUAGE.category.label)}
              </label>

              <input
                name="count"
                id="count"
                type="number"
                step={0.01}
                value={countValue || ''}
                placeholder={'0'}
                className={s.input}
                style={{ width: '80px' }}
                onKeyPress={handleCountKeyPress}
                onChange={handleCountChange}
              />

              <select
                id="category"
                name="category"
                className={s.input}
                defaultValue={'increase'}
                onChange={event => setPriceMultiplier(event.target.value)}
              >
                <option value={'increase'}>{'₴'}</option>
                <option value={'percent'}>{'%'}</option>
              </select>

              <Button
                title={languageDeterminer(LANGUAGE.category.button.title)}
                type="button"
                styles={s.btn}
                onClick={handleMassPriceChange}
              >
                {languageDeterminer(LANGUAGE.category.button.text)}
              </Button>
            </form>
          </section>

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
                {optionList && (
                  <OptionList products={productsByCategoryOrTag} />
                )}
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
                className={s.select}
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
            <ProductList products={visibleProducts} specificCategory />
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

SpecificCategoryView.propTypes = {
  productsByCategoryOrTag: PropTypes.array.isRequired,
};
