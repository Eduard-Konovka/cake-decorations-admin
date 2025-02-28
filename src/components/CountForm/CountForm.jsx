import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';

export default function CountForm({
  value,
  min = 1,
  max = Infinity,
  styles,
  setCount,
}) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  function handleKeyPress(event) {
    if (
      GLOBAL.keyСodes.prohibited.includes(event.charCode) ||
      (event.charCode === GLOBAL.keyСodes.zero && !event.target.value)
    ) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    const inputValue = Number(event.target.value);

    if (
      inputValue >= min &&
      inputValue <= max &&
      Number.isInteger(inputValue)
    ) {
      setCount(inputValue);
    } else {
      toast.error(
        `${languageDeterminer(
          LANGUAGE.countForm.error.prefix,
        )} ${min} ${languageDeterminer(
          LANGUAGE.countForm.error.suffix,
        )} ${max} ${languageDeterminer(LANGUAGE.countForm.error.postfix)}`,
      );
    }
  }

  return (
    <form className={styles.formStyle}>
      <label htmlFor="count" className={styles.labelStyle}>
        {languageDeterminer(LANGUAGE.countForm.label)}
      </label>

      <input
        name="count"
        id="count"
        type="number"
        min={min}
        max={max}
        value={value > 0 ? value : ''}
        className={styles.inputStyle}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
      />
    </form>
  );
}

CountForm.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  styles: PropTypes.shape({
    formStyle: PropTypes.string,
    labelStyle: PropTypes.string,
    inputStyle: PropTypes.string,
  }).isRequired,
  setCount: PropTypes.func.isRequired,
};
