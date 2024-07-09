import PropTypes from 'prop-types';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';

export default function OptionList({ books }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const arr = books.map(book => book.price).sort((a, b) => a - b);
  const uniqArr = [...new Set(arr)];

  return (
    <>
      <option value={'allPrices'}>
        {languageDeterminer(LANGUAGE.optionList.all)}
      </option>
      <option value={`${GLOBAL.pricesBreakPoint.min}>`}>{`${languageDeterminer(
        LANGUAGE.optionList.down,
      )} ${GLOBAL.pricesBreakPoint.first}`}</option>
      <option value={`${GLOBAL.pricesBreakPoint.first}>`}>{`${
        GLOBAL.pricesBreakPoint.first
      } ${languageDeterminer(LANGUAGE.optionList.middle)} ${
        GLOBAL.pricesBreakPoint.second
      }`}</option>
      <option
        value={`${GLOBAL.pricesBreakPoint.second}>`}
      >{`${languageDeterminer(LANGUAGE.optionList.up)} ${
        GLOBAL.pricesBreakPoint.second
      }`}</option>
      {uniqArr.map(price => (
        <option value={price} key={price}>
          {price}
        </option>
      ))}
    </>
  );
}

OptionList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  ),
};
