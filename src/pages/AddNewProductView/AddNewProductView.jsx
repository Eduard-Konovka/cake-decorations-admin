import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState } from 'state';
import { Button, CountForm } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './AddNewProductView.module.css';

export default function AddNewProductView({ propFn }) {
  const { mainHeight } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  const handleTitleChange = event => {
    const value = event.target.value.trim();
    setName(value);
  };

  const handleCategoryChange = event => {
    const value = event.target.value.trim();
    setCategory(value);
  };

  const handleDescriptionChange = event => {
    const value = event.target.value.trim();
    setDescription(value);
  };

  const handleSubmit = () => {
    toast.success('Товар успішно додано в каталог товарів');
    propFn(`Категория: ${category}\nТовар: ${name}\nОпис: ${description}`);
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <div className={s.row}>
        <section className={s.imagesSection}>
          <img
            src={imageNotFound}
            alt={'template'}
            className={s.mainImage}
            onClick={() => {}}
          />

          {/* {product?.images?.length > 1 && (
            <div className={s.additionalImagesBox}>
              {product.images.map((imageLink, idx) => (
                <img
                  key={imageLink}
                  src={imageLink}
                  alt={language === 'RU' ? product.ruTitle : product.uaTitle}
                  className={s.additionalImage}
                  onClick={() => setMainImageIdx(idx)}
                />
              ))}
            </div>
          )} */}
        </section>

        <div className={s.thumb}>
          <div className={s.monitor}>
            <section className={s.statsSection}>
              <form className={s.form}>
                <label htmlFor="title" className={s.title}>
                  {`${'Назва товару'}: `}
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
                  pattern={languageDeterminer(GLOBAL.signInViewPattern)}
                  placeholder={languageDeterminer(
                    LANGUAGE.signInView.inputPlaceholder,
                  )}
                  autoComplete="given-name family-name"
                  minLength={GLOBAL.signInViewInput.minLength}
                  maxLength={GLOBAL.signInViewInput.maxLength}
                  className={s.productInput}
                  onChange={handleTitleChange}
                />

                <div className={s.stat}>
                  <label htmlFor="category" className={s.statName}>
                    {languageDeterminer(LANGUAGE.specificProductView.category)}
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
                    pattern={languageDeterminer(GLOBAL.signInViewPattern)}
                    placeholder={languageDeterminer(
                      LANGUAGE.signInView.inputPlaceholder,
                    )}
                    autoComplete="given-name family-name"
                    minLength={GLOBAL.signInViewInput.minLength}
                    maxLength={GLOBAL.signInViewInput.maxLength}
                    className={s.productInput}
                    onChange={handleCategoryChange}
                  />
                </div>

                {/* {product.product_details &&
                  product.product_details.map(detail => (
                    <p key={detail.attribute_name} className={s.stat}>
                      <span className={s.statName}>
                        {detail.attribute_name}:
                      </span>
                      {detail.attribute_value}
                    </p>
                  ))} */}
              </form>
            </section>

            <section className={s.controlsSection}>
              <p className={s.count}>
                <span className={s.boldfont}>
                  {languageDeterminer(LANGUAGE.specificProductView.price)}
                </span>
                {10} ₴
              </p>

              <CountForm
                value={3}
                price={10}
                min={GLOBAL.productCount.min}
                max={GLOBAL.productCount.max}
                styles={{
                  formStyle: s.count,
                  labelStyle: s.boldfont,
                  inputStyle: s.countInput,
                  spanStyle: s.boldfont,
                  totalPriceStyle: s.count,
                }}
                setCount={() => {}}
              />

              <div>
                <Button
                  title={languageDeterminer(LANGUAGE.product.button.title)}
                  type="button"
                  styles={s.btn}
                  onClick={handleSubmit}
                >
                  {'Додати'}
                </Button>
              </div>
            </section>
          </div>

          <section className={s.finishDescriptionSection}>
            <label htmlFor="finishDescription" className={s.statName}>
              {'Опис товару: '}
            </label>

            <input
              id="finishDescription"
              name="finishDescription"
              type="text"
              title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
              pattern={languageDeterminer(GLOBAL.signInViewPattern)}
              placeholder={languageDeterminer(
                LANGUAGE.signInView.inputPlaceholder,
              )}
              autoComplete="given-name family-name"
              minLength={GLOBAL.signInViewInput.minLength}
              maxLength={GLOBAL.signInViewInput.maxLength}
              className={s.productInput}
              onChange={handleDescriptionChange}
            />
          </section>
        </div>
      </div>

      <section className={s.startDescriptionSection}>
        <label htmlFor="startDescription" className={s.statName}>
          {'Опис товару: '}
        </label>

        <input
          id="startDescription"
          name="startDescription"
          type="text"
          title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
          pattern={languageDeterminer(GLOBAL.signInViewPattern)}
          placeholder={languageDeterminer(LANGUAGE.signInView.inputPlaceholder)}
          autoComplete="given-name family-name"
          minLength={GLOBAL.signInViewInput.minLength}
          maxLength={GLOBAL.signInViewInput.maxLength}
          className={s.productInput}
          onChange={handleDescriptionChange}
        />
      </section>
    </main>
  );
}

AddNewProductView.propTypes = {
  propFn: PropTypes.func.isRequired,
};
