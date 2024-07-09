import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { getTags, getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { TAMPLATES, LANGUAGE } from 'constants';
import s from './Tags.module.css';

export default function Tags({ title, styles, setBooksByTag }) {
  const { books } = useGlobalState('global');
  const tags = getTags(title.toLowerCase(), TAMPLATES.tags);
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  function handleTagClick(tag) {
    const booksTitlesToLowerCase = books.map(book => ({
      ...book,
      title: book.title.toLowerCase(),
    }));

    const targetBooksToLowerCase = booksTitlesToLowerCase.filter(book =>
      book.title.includes(tag),
    );

    const bookIds = targetBooksToLowerCase.map(book => book._id);

    const targetBooks = books.filter(book => bookIds.includes(book._id));

    setBooksByTag(targetBooks);
  }

  return tags.map(tag => (
    <Link
      key={tag}
      to="/books"
      title={`${languageDeterminer(LANGUAGE.tags)} "${tag}"`}
      className={classNames(s.tag, styles)}
      onClick={() => handleTagClick(tag)}
    >
      {tag}
    </Link>
  ));
}

Tags.propTypes = {
  title: PropTypes.string.isRequired,
  styles: PropTypes.string,
  setBooksByTag: PropTypes.func.isRequired,
};
