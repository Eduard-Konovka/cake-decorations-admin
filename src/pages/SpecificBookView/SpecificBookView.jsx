import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { fetchBook } from 'api';
import { Spinner, Button, Tags, Links, CountForm } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './SpecificBookView.module.css';

export default function SpecificBookView({
  setBooksByTag,
  changeSelectCount,
  addToCart,
}) {
  const location = useLocation();
  const { mainHeight, books, cart } = useGlobalState('global');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({});

  const bookId = location.pathname.slice(8, location.pathname.length);
  const selectedBook = cart.filter(book => book._id === bookId)[0];
  const savedBook = books.filter(book => book._id === bookId)[0];

  const [count, setCount] = useState(selectedBook ? selectedBook.count : 0);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    if (books.length > 0) {
      setBook(savedBook);
    } else {
      setLoading(true);

      fetchBook(bookId)
        .then(book => {
          setBook(book);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [bookId, books.length, savedBook]);

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

      {book && (
        <>
          <div className={s.row}>
            <img
              src={book.image !== '' ? book.image : imageNotFound}
              alt={book.title}
              className={s.image}
            />

            <div className={s.thumb}>
              <div className={s.monitor}>
                <div className={s.stats}>
                  <h3 className={s.title}>{book.title}</h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(
                        LANGUAGE.specificBookView.product_type,
                      )}
                    </span>
                    {book.product_type}
                  </p>

                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.specificBookView.tags)}
                    </span>
                    {book.title && (
                      <Tags
                        title={book.title}
                        styles={s.tag}
                        setBooksByTag={setBooksByTag}
                      />
                    )}
                  </p>

                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.specificBookView.links)}
                    </span>
                    {book.title && <Links title={book.title} styles={s.link} />}
                  </p>
                </div>

                <div className={s.controls}>
                  <p className={s.count}>
                    <span className={s.boldfont}>
                      {languageDeterminer(LANGUAGE.specificBookView.price)}
                    </span>
                    {book.price} ₴
                  </p>

                  <CountForm
                    value={count}
                    price={book.price}
                    min={GLOBAL.bookCount.min}
                    max={GLOBAL.bookCount.max}
                    styles={{
                      formStyle: s.count,
                      labelStyle: s.boldfont,
                      inputStyle: s.input,
                      spanStyle: s.boldfont,
                      totalPriceStyle: s.count,
                    }}
                    setCount={count => {
                      setCount(count);
                      selectedBook &&
                        changeSelectCount({
                          count,
                          _id: selectedBook._id,
                        });
                    }}
                  />

                  <div>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.specificBookView.buttonTitle,
                      )}
                      type="button"
                      disabled={!count}
                      styles={s.btn}
                      onClick={() =>
                        addToCart({ ...book, count: Number(count) })
                      }
                    >
                      {languageDeterminer(LANGUAGE.specificBookView.buttonText)}
                    </Button>
                  </div>
                </div>
              </div>

              <p className={s.finishDescription}>{book.description}</p>
            </div>
          </div>

          <p className={s.startDescription}>{book.description}</p>
        </>
      )}
    </main>
  );
}

SpecificBookView.propTypes = {
  setBooksByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};
