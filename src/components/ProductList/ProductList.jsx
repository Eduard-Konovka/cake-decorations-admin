import PropTypes from 'prop-types';
import Product from 'components/Product';
import s from './ProductList.module.css';

export default function ProductList({ books }) {
  return (
    <ul className={s.list}>
      {books.map(item => (
        <li key={item._id} className={s.item}>
          <Product book={item} />
        </li>
      ))}
    </ul>
  );
}

ProductList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
