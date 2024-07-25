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

export default function ProductsView({ booksByTag }) {
  const { mainHeight, books } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booksByName, setProductsByName] = useState([]);
  const [booksByPrice, setProductsByPrice] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    if (books.length === 0) {
      setLoading(true);

      fetchProducts()
        .then(books => {
          books.sort(
            (firstProduct, secondProduct) =>
              firstProduct.barcode - secondProduct.barcode,
          );
          changeGlobalState(updateProducts, books);
          setProductsByName(books);
          setProductsByPrice(books);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    } else if (booksByTag.length !== 0) {
      setProductsByName(booksByTag);
      setProductsByPrice(books);
    } else {
      setProductsByName(books);
      setProductsByPrice(books);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const difference = booksByName.filter(book => booksByPrice.includes(book));
    setVisibleProducts(difference);
  }, [booksByName, booksByPrice]);

  useEffect(() => {
    setOptionList(true);
  }, [optionList]);

  function handleKeyPress(event) {
    if (event.charCode === GLOBAL.keyСodes.enter) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    setSearchByName(event.target.value);
  }

  function handleNameClick() {
    const visibleProductsToLowerCase = books.map(book => ({
      ...book,
      title: book.title.toLowerCase(),
    }));

    const queryArr = searchByName
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const targetProductsToLowerCase = visibleProductsToLowerCase.filter(
      book => {
        let result = !book;

        for (let i = 0; i < queryArr.length; i++) {
          if (book.title.includes(queryArr[i])) {
            result = book;
          }
        }

        return result;
      },
    );

    const bookIds = targetProductsToLowerCase.map(
      bookToLowerCase => bookToLowerCase._id,
    );

    const targetProducts = books.filter(book => bookIds.includes(book._id));

    if (!searchByName) {
      setProductsByName(books);
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
        setProductsByPrice(books);
        break;

      case `${GLOBAL.pricesBreakPoint.min}>`:
        setProductsByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.min &&
              book.price <= GLOBAL.pricesBreakPoint.first,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.first}>`:
        setProductsByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.first &&
              book.price <= GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.second}>`:
        setProductsByPrice(
          books.filter(book => book.price > GLOBAL.pricesBreakPoint.second),
        );
        break;

      default:
        setProductsByPrice(
          books.filter(book => book.price === Number(event.target.value)),
        );
        break;
    }
  }

  function handleSort(event) {
    const value = event.target.value;

    const ascendingCode = [...visibleProducts].sort(
      (firstProduct, secondProduct) =>
        firstProduct.barcode - secondProduct.barcode,
    );
    const descendingCode = [...visibleProducts].sort(
      (firstProduct, secondProduct) =>
        secondProduct.barcode - firstProduct.barcode,
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
    setProductsByName(books);
    setProductsByPrice(books);
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

      {!loading && !error && books.length === 0 && (
        <Blank
          title={languageDeterminer(LANGUAGE.noProducts)}
          image={imageBlank}
          alt={languageDeterminer(LANGUAGE.openShopAlt)}
        />
      )}

      {books.length > 0 && (
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
                {optionList && <OptionList books={books} />}
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

          <section className={s.bookList}>
            <ProductList books={visibleProducts} />
          </section>
        </>
      )}
    </main>
  );
}

ProductsView.propTypes = {
  booksByTag: PropTypes.array.isRequired,
};
