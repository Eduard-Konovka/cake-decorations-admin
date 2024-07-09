import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateBooks } from 'state';
import { fetchBooks } from 'api';
import { Spinner, Blank, Button, OptionList, BookList } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { ReactComponent as SearchIcon } from 'assets/search.svg';
import imageBlank from 'assets/shop.jpg';
import s from './BooksView.module.css';

export default function BooksView({ booksByTag }) {
  const { mainHeight, books } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booksByName, setBooksByName] = useState([]);
  const [booksByPrice, setBooksByPrice] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [optionList, setOptionList] = useState(true);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    if (books.length === 0) {
      setLoading(true);

      fetchBooks()
        .then(books => {
          books.sort((firstBook, secondBook) => firstBook.id - secondBook.id);
          changeGlobalState(updateBooks, books);
          setBooksByName(books);
          setBooksByPrice(books);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    } else if (booksByTag.length !== 0) {
      setBooksByName(booksByTag);
      setBooksByPrice(books);
    } else {
      setBooksByName(books);
      setBooksByPrice(books);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const difference = booksByName.filter(book => booksByPrice.includes(book));
    setVisibleBooks(difference);
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
    const visibleBooksToLowerCase = books.map(book => ({
      ...book,
      title: book.title.toLowerCase(),
    }));

    const queryArr = searchByName
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const targetBooksToLowerCase = visibleBooksToLowerCase.filter(book => {
      let result = !book;

      for (let i = 0; i < queryArr.length; i++) {
        if (book.title.includes(queryArr[i])) {
          result = book;
        }
      }

      return result;
    });

    const bookIds = targetBooksToLowerCase.map(
      bookToLowerCase => bookToLowerCase._id,
    );

    const targetBooks = books.filter(book => bookIds.includes(book._id));

    if (!searchByName) {
      setBooksByName(books);
    } else if (targetBooks.length > 0) {
      setBooksByName(targetBooks);
    } else {
      toast.error(languageDeterminer(LANGUAGE.searchByName.error));
      setBooksByName([]);
    }
  }

  function handlePriceChange(event) {
    switch (event.target.value) {
      case 'allPrices':
        setBooksByPrice(books);
        break;

      case `${GLOBAL.pricesBreakPoint.min}>`:
        setBooksByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.min &&
              book.price <= GLOBAL.pricesBreakPoint.first,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.first}>`:
        setBooksByPrice(
          books.filter(
            book =>
              book.price > GLOBAL.pricesBreakPoint.first &&
              book.price <= GLOBAL.pricesBreakPoint.second,
          ),
        );
        break;

      case `${GLOBAL.pricesBreakPoint.second}>`:
        setBooksByPrice(
          books.filter(book => book.price > GLOBAL.pricesBreakPoint.second),
        );
        break;

      default:
        setBooksByPrice(
          books.filter(book => book.price === Number(event.target.value)),
        );
        break;
    }
  }

  function handleSort(event) {
    const value = event.target.value;

    const ascendingCode = [...visibleBooks].sort(
      (firstBook, secondBook) => firstBook.id - secondBook.id,
    );
    const descendingCode = [...visibleBooks].sort(
      (firstBook, secondBook) => secondBook.id - firstBook.id,
    );
    const ascendingPrice = [...visibleBooks].sort(
      (firstBook, secondBook) => firstBook.price - secondBook.price,
    );
    const descendingPrice = [...visibleBooks].sort(
      (firstBook, secondBook) => secondBook.price - firstBook.price,
    );

    switch (value) {
      case 'ascendingCode':
        setVisibleBooks(ascendingCode);
        break;

      case 'descendingCode':
        setVisibleBooks(descendingCode);
        break;

      case 'ascendingPrice':
        setVisibleBooks(ascendingPrice);
        break;

      case 'descendingPrice':
        setVisibleBooks(descendingPrice);
        break;

      default:
        setVisibleBooks(ascendingCode);
        break;
    }
  }

  function reset() {
    setSearchByName('');
    setOptionList(false);
    setBooksByName(books);
    setBooksByPrice(books);
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
            <BookList books={visibleBooks} />
          </section>
        </>
      )}
    </main>
  );
}

BooksView.propTypes = {
  booksByTag: PropTypes.array.isRequired,
};
