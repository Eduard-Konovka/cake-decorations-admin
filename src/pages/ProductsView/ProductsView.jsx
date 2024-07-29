import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateProducts } from 'state';
import { fetchProducts } from 'api';
import { Spinner, Blank, Button, OptionList, ProductList } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { ReactComponent as SearchIcon } from 'assets/search.svg';
import imageBlank from 'assets/shop.jpg';
import s from './ProductsView.module.css';

export default function ProductsView({ productsByTag }) {
  const { mainHeight, products } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsByName, setProductsByName] = useState([]);
  const [productsByPrice, setProductsByPrice] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);
  const [ordinalOfDozen, setOrdinalOfDozen] = useState(0);
  const [target, setTarget] = useState(null);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      getProducts();
    } else if (productsByTag.length !== 0) {
      setProductsByName(productsByTag);
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
  }, [productsByName, productsByPrice]);

  useEffect(() => {
    setOptionList(true);
  }, [optionList]);

  useEffect(() => {
    const setObserver = () => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      };

      const observerCallback = (elements, observer) => {
        elements.forEach(element => {
          if (element.isIntersecting) {
            observer.unobserve(target);
            setOrdinalOfDozen(ordinalOfDozen => ordinalOfDozen + 1);
            getProducts();
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );

      observer.observe(target);
    };

    target && setObserver();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  setTimeout(() => {
    setTarget(document.getElementById('productList')?.lastElementChild);
  }, 100);

  function getProducts() {
    fetchProducts(ordinalOfDozen + 1)
      .then(nextDozenProducts => {
        setOrdinalOfDozen(ordinalOfDozen => ordinalOfDozen + 1);
        nextDozenProducts.sort(
          (firstProduct, secondProduct) => firstProduct._id - secondProduct._id,
        );
        changeGlobalState(updateProducts, [...products, ...nextDozenProducts]);
        setProductsByName([...products, ...nextDozenProducts]);
        setProductsByPrice([...products, ...nextDozenProducts]);
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));
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

    const ascendingCode = [...visibleProducts].sort(
      (firstProduct, secondProduct) => firstProduct._id - secondProduct._id,
    );
    const descendingCode = [...visibleProducts].sort(
      (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
    );
    const ascendingPrice = [...visibleProducts].sort(
      (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
    );
    const descendingPrice = [...visibleProducts].sort(
      (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
    );

    switch (value) {
      case 'ascendingCode':
        setVisibleProducts(ascendingCode);
        break;

      case 'descendingCode':
        setVisibleProducts(descendingCode);
        break;

      case 'ascendingPrice':
        setVisibleProducts(ascendingPrice);
        break;

      case 'descendingPrice':
        setVisibleProducts(descendingPrice);
        break;

      default:
        setVisibleProducts(ascendingCode);
        break;
    }
  }

  function reset() {
    setSearchByName('');
    setOptionList(false);
    setProductsByName(products);
    setProductsByPrice(products);
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

              <select className={s.inputByPrice} onChange={handlePriceChange}>
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
              <label htmlFor="sort" className={s.sortLabel}>
                {languageDeterminer(LANGUAGE.sortBy.label)}
              </label>

              <select
                name="sort"
                className={s.inputBySort}
                onChange={handleSort}
              >
                <option value={'ascendingPrice'}>
                  {languageDeterminer(LANGUAGE.sortBy.ascendingPrice)}
                </option>
                <option value={'descendingPrice'}>
                  {languageDeterminer(LANGUAGE.sortBy.descendingPrice)}
                </option>
                <option value={'ascendingCode'}>
                  {languageDeterminer(LANGUAGE.sortBy.ascendingCode)}
                </option>
                <option value={'descendingCode'}>
                  {languageDeterminer(LANGUAGE.sortBy.descendingCode)}
                </option>
              </select>
            </form>
          </section>

          <section className={s.productList}>
            <ProductList products={visibleProducts} />
          </section>
        </>
      )}
    </main>
  );
}

ProductsView.propTypes = {
  productsByTag: PropTypes.array.isRequired,
};
