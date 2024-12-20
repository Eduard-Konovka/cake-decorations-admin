import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState } from 'state';
import { Button, CountForm } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { db } from 'db';
import imageNotFound from 'assets/notFound.png';
import s from './AddNewProductView.module.css';

const dbItem = {
  _id: '1862834532',
  uaTitle:
    'Кондитерські цукрові прикраси Корона рожева на торт для дівчинки набір з безе',
  category: '116763867',
  description:
    'Цукрові прикраси є безпечними для дітей. Для прикраси тортів, рулетів, тістечок, булочок, кексів та багато іншого. Зазвичай прикрашають декором поверх виробів. Виробник: Україна Діаметр безе: від 2см до 3см Розмір корони: 6см В упаковці 25 елементів: корона та 24 дрібнички. Розмір коробки (упаковки): дл/шир/вис - 11.5см*11.5см*5.5см Ми всі добре запакуємо, щоб усе доїхало цілим))',
  images: [
    'https://images.prom.ua/D3Fg9hnzGbJpWvmCGxxfnEuEqzMvZ-ukFKsz7LYLn94=/4576161641_konditerski-tsukrovi-prikrasi.jpg',
    'https://images.prom.ua/HT5G0x7sHh78WQ06x9gnATWH6g0p0y_9peRw9i67lfA=/4576161756_konditerski-tsukrovi-prikrasi.jpg',
    'https://images.prom.ua/5EiMv-FsHBTx93pAtxoIny20e_XP522kfzFM6r5ZP9w=/4576237268_konditerski-tsukrovi-prikrasi.jpg',
    'https://images.prom.ua/zbmsDJo3lW35c3AMc9U58IY8y7bYoRxfp23a1qgUDMg=/4576237490_konditerski-tsukrovi-prikrasi.jpg',
    'https://images.prom.ua/pl71i9zYVU46wWSKdDS4ovsSUHX0gqLvPctrEI7fRD8=/4576237798_konditerski-tsukrovi-prikrasi.jpg',
  ],
  price: 1000,
  product_details: [
    {
      attribute_name: 'Країна виробник',
      attribute_value: 'Україна',
    },
    {
      attribute_name: 'Вид кондитерських виробів',
      attribute_value: 'Безе',
    },
    {
      attribute_name: 'Тип',
      attribute_value: 'Фасовані',
    },
    {
      attribute_name: 'Вид декору',
      attribute_value: 'Цукрові фігури',
    },
  ],
  // availability: 'in stock',
  // product_type: 'Кондитерський декор',
  // identifier_exists: 'no',
  // condition: 'new',
  // color: 'Рожевий',
};

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

  const handleSubmit = async () => {
    await setDoc(doc(db, 'products', Date.now().toString()), {
      uaTitle: name,
      category,
      description,
      images: dbItem.images,
      price: dbItem.price,
    });

    propFn(`Товар ${name} успішно додано в каталог товарів`);
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <div className={s.row}>
        <section className={s.imagesSection}>
          <img
            src={imageNotFound}
            alt={'template'}
            className={s.mainImage}
            onClick={() => toast.warn('Click image')}
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
                  defaultValue="Test product"
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
                    // minLength={GLOBAL.signInViewInput.minLength}
                    // maxLength={GLOBAL.signInViewInput.maxLength}
                    defaultValue="116763867"
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
                setCount={() => toast.warn('Click CountForm')}
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
              // minLength={GLOBAL.signInViewInput.minLength}
              // maxLength={GLOBAL.signInViewInput.maxLength}
              defaultValue={dbItem.description}
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
          // minLength={GLOBAL.signInViewInput.minLength}
          // maxLength={GLOBAL.signInViewInput.maxLength}
          defaultValue={dbItem.description}
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
