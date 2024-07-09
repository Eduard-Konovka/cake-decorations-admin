import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Book.module.css';

export default function Book({ book }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <article>
      <img
        className={s.image}
        src={book.image && book.image !== '' ? book.image : defaultImage}
        alt={book.title}
      />

      <div className={s.thumb}>
        <h3 className={s.title}>
          {book.title.length < GLOBAL.titleLength
            ? book.title
            : book.title.slice(0, GLOBAL.titleLength) + '...'}
        </h3>

        <p className={s.shortDescription}>{book.shortDescription}</p>
      </div>

      <p className={s.author}>
        Author: <span className={s.value}>{book.author}</span>
      </p>

      <p className={s.sku}>
        SKU: <span className={s.value}>{book.id}</span>
      </p>

      <div className={s.control}>
        <p className={s.price}>
          Price: <span className={s.value}>${book.price}</span>
        </p>

        <Button title={languageDeterminer(LANGUAGE.product.title)}>
          <Link to={`/books/:${book._id}`} className={s.btnLink}>
            {languageDeterminer(LANGUAGE.product.text)}
          </Link>
        </Button>
      </div>
    </article>
  );
}

Book.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
  }).isRequired,
};
