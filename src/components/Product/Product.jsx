import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Product.module.css';

export default function Product({ product }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <article>
      <img
        className={s.image}
        src={product?.images?.length > 0 ? product.images[0] : defaultImage}
        alt={product.title}
      />

      <div className={s.thumb}>
        <h3 className={s.title}>
          {product.title.length < GLOBAL.titleLength
            ? product.title
            : product.title.slice(0, GLOBAL.titleLength) + '...'}
        </h3>

        <p className={s.shortDescription}>
          {product.description.slice(0, GLOBAL.titleLength) + '...'}
        </p>
      </div>

      <p className={s.product_type}>
        {languageDeterminer(LANGUAGE.product.product_type)}
        <span className={s.value}>{product.product_type}</span>
      </p>

      <p className={s.barcode}>
        {languageDeterminer(LANGUAGE.product.barcode)}
        <span className={s.value}>{product._id}</span>
      </p>

      <div className={s.control}>
        <p className={s.price}>
          {languageDeterminer(LANGUAGE.product.price)}
          <span className={s.value}>{product.price} ₴</span>
        </p>

        <Button title={languageDeterminer(LANGUAGE.product.buttonTitle)}>
          <Link to={`/products/${product._id}`} className={s.btnLink}>
            {languageDeterminer(LANGUAGE.product.buttonText)}
          </Link>
        </Button>
      </div>
    </article>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
