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
import s from './SpecificProductView.module.css';

export default function SpecificProductView({
  setProductsByTag,
  changeSelectCount,
  addToCart,
}) {
  const location = useLocation();
  const { mainHeight, books, cart } = useGlobalState('global');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [book, setProduct] = useState({});

  const bookId = location.pathname.slice(8, location.pathname.length);
  const selectedProduct = cart.filter(book => book._id === bookId)[0];
  const savedProduct = books.filter(book => book._id === bookId)[0];

  const [count, setCount] = useState(
    selectedProduct ? selectedProduct.count : 0,
  );

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    if (books.length > 0) {
      setProduct(savedProduct);
    } else {
      setLoading(true);

      fetchBook(bookId)
        .then(book => {
          setProduct(book);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [bookId, books.length, savedProduct]);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="red" />}

      {!loading && error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      )}

      {!loading && !error && book && (
        <>
          <div className={s.row}>
            <div className={s.imagesBox}>
              <img
                src={book?.images?.length > 0 ? book.images[0] : imageNotFound}
                alt={book.title}
                className={s.image}
              />

              {book?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {book.images.map(additionalImage => (
                    <img
                      src={additionalImage}
                      alt={book.title}
                      className={s.additionalImage}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={s.thumb}>
              <div className={s.monitor}>
                <div className={s.stats}>
                  <h3 className={s.title}>{book.title}</h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(
                        LANGUAGE.specificProductView.product_type,
                      )}
                    </span>
                    {book.product_type}
                  </p>

                  {book.product_details &&
                    book.product_details.map(detail => (
                      <p className={s.stat}>
                        <span className={s.statName}>
                          {detail.attribute_name}:
                        </span>
                        {detail.attribute_value}
                      </p>
                    ))}

                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.specificProductView.tags)}
                    </span>
                    {book.title && (
                      <Tags
                        title={book.title}
                        styles={s.tag}
                        setProductsByTag={setProductsByTag}
                      />
                    )}
                  </p>

                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.specificProductView.links)}
                    </span>
                    {book.title && <Links title={book.title} styles={s.link} />}
                  </p>
                </div>

                <div className={s.controls}>
                  <p className={s.count}>
                    <span className={s.boldfont}>
                      {languageDeterminer(LANGUAGE.specificProductView.price)}
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
                      selectedProduct &&
                        changeSelectCount({
                          count,
                          _id: selectedProduct._id,
                        });
                    }}
                  />

                  <div>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.specificProductView.buttonTitle,
                      )}
                      type="button"
                      disabled={!count}
                      styles={s.btn}
                      onClick={() =>
                        addToCart({ ...book, count: Number(count) })
                      }
                    >
                      {languageDeterminer(
                        LANGUAGE.specificProductView.buttonText,
                      )}
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

SpecificProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};