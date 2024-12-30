import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalState, useChangeGlobalState, updateProducts } from 'state';
import { fetchProducts, addProductApi } from 'api';
import { Button, CountForm } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './AddNewProductView.module.css';

const dbItem = {
  _id: '1862834532',
  uaTitle:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis velit eos dolore, reiciendis facere reprehenderit doloremque voluptatem ut nisi nihil tempora aliquam earum commodi id dicvsfdvsfv!',
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

export default function AddNewProductView() {
  const navigate = useNavigate();
  const { mainHeight } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState([]);

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

  const addDetail = () => {
    const productDetails = {
      attribute_name: 'Властивість',
      attribute_value: 'фффффффффф',
      timeStamp: Date.now().toString(),
    };

    setDetails(prevDeteils => [...prevDeteils, productDetails]);
  };

  const deleteDetail = detail => {
    setDetails(prevDetails =>
      prevDetails.filter(
        productDetail => productDetail.timeStamp !== detail.timeStamp,
      ),
    );
  };

  const addProduct = async () => {
    const newProduct = {
      _id: Date.now().toString(),
      title: name,
      uaTitle: name,
      category,
      description,
      images: dbItem.images,
      price: dbItem.price,
    };

    await addProductApi(newProduct);

    fetchProducts()
      .then(products => {
        products.sort(
          (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
        );
        changeGlobalState(updateProducts, products);
        navigate(`/products/${newProduct._id}`);
      })
      .catch(error =>
        toast.error(
          `${languageDeterminer(
            LANGUAGE.toastErrors.gettingProducts,
          )}:\n${error}`,
        ),
      );
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
                  {languageDeterminer(LANGUAGE.addNewProductView.title)}
                </label>

                <textarea
                  id="title"
                  name="title"
                  rows="4"
                  title={languageDeterminer(
                    LANGUAGE.addNewProductView.titleInput,
                  )}
                  placeholder={languageDeterminer(
                    LANGUAGE.signInView.inputPlaceholder,
                  )}
                  autoComplete="given-name family-name"
                  minLength={GLOBAL.addNewProductView.input.minLength}
                  maxLength={GLOBAL.addNewProductView.input.maxLength}
                  defaultValue={dbItem.uaTitle}
                  autoCorrect="on"
                  className={s.titleInput}
                  onChange={handleTitleChange}
                />

                <div className={s.stat}>
                  <label htmlFor="category" className={s.statName}>
                    {languageDeterminer(LANGUAGE.productViews.category)}
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    title={languageDeterminer(
                      LANGUAGE.addNewProductView.titleInput,
                    )}
                    pattern={languageDeterminer(
                      GLOBAL.addNewProductView.pattern,
                    )}
                    placeholder={languageDeterminer(
                      LANGUAGE.signInView.inputPlaceholder,
                    )}
                    autoComplete="given-name family-name"
                    minLength={GLOBAL.addNewProductView.input.minLength}
                    // maxLength={GLOBAL.addNewProductView.input.maxLength}
                    defaultValue="116763867"
                    className={s.input}
                    onChange={handleCategoryChange}
                  />
                </div>

                {details.length > 0 &&
                  details.map((detail, idx) => (
                    <div key={detail.timeStamp} className={s.detailsStat}>
                      <div className={s.detailName}>
                        <label
                          htmlFor={`detail${detail.timeStamp}`}
                          className={s.statName}
                        >
                          {'Властивість: '}
                        </label>

                        <input
                          id={`detail${detail.timeStamp}`}
                          name={`detail${detail.timeStamp}`}
                          type="text"
                          title={languageDeterminer(
                            LANGUAGE.addNewProductView.titleInput,
                          )}
                          pattern={languageDeterminer(
                            GLOBAL.addNewProductView.pattern,
                          )}
                          placeholder={languageDeterminer(
                            LANGUAGE.signInView.inputPlaceholder,
                          )}
                          autoComplete="given-name family-name"
                          defaultValue={idx + detail.timeStamp}
                          minLength={GLOBAL.addNewProductView.input.minLength}
                          // maxLength={GLOBAL.addNewProductView.input.maxLength}
                          className={s.input}
                          onChange={() => console.log(`Change detail${idx}`)}
                        />
                      </div>

                      <div className={s.detailValue}>
                        <label
                          htmlFor={`value${detail.timeStamp}`}
                          className={s.statName}
                        >
                          {'Значення: '}
                        </label>

                        <input
                          id={`value${detail.timeStamp}`}
                          name={`value${detail.timeStamp}`}
                          type="text"
                          title={languageDeterminer(
                            LANGUAGE.addNewProductView.titleInput,
                          )}
                          pattern={languageDeterminer(
                            GLOBAL.addNewProductView.pattern,
                          )}
                          placeholder={languageDeterminer(
                            LANGUAGE.signInView.inputPlaceholder,
                          )}
                          autoComplete="given-name family-name"
                          defaultValue={idx + detail.timeStamp}
                          minLength={GLOBAL.addNewProductView.input.minLength}
                          // maxLength={GLOBAL.addNewProductView.input.maxLength}
                          className={s.input}
                          onChange={() => console.log(`Change value${idx}`)}
                        />
                      </div>

                      <Button
                        title={languageDeterminer(
                          LANGUAGE.productViews.addButton.title,
                        )}
                        type="button"
                        onClick={() => deleteDetail(detail)}
                      >
                        {`Delete ${idx}`}
                      </Button>
                    </div>
                  ))}

                <Button
                  title={languageDeterminer(
                    LANGUAGE.productViews.addButton.title,
                  )}
                  type="button"
                  onClick={addDetail}
                >
                  {languageDeterminer(LANGUAGE.productViews.addButton.text)}
                </Button>
              </form>
            </section>

            <section className={s.controlsSection}>
              <p className={s.count}>
                <span className={s.boldfont}>
                  {languageDeterminer(LANGUAGE.productViews.price)}
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
                  title={languageDeterminer(
                    LANGUAGE.productViews.saveButton.title,
                  )}
                  type="button"
                  styles={s.btn}
                  onClick={addProduct}
                >
                  {languageDeterminer(LANGUAGE.productViews.saveButton.text)}
                </Button>
              </div>
            </section>
          </div>

          <section className={s.finishDescriptionSection}>
            <label htmlFor="finishDescription" className={s.statName}>
              {'Опис товару: '}
            </label>

            <textarea
              id="finishDescription"
              name="finishDescription"
              rows="10"
              title={languageDeterminer(LANGUAGE.addNewProductView.titleInput)}
              placeholder={languageDeterminer(
                LANGUAGE.signInView.inputPlaceholder,
              )}
              autoComplete="given-name family-name"
              minLength={GLOBAL.addNewProductView.input.minLength}
              // maxLength={GLOBAL.addNewProductView.input.maxLength}
              defaultValue={dbItem.description}
              autoCorrect="on"
              className={s.textarea}
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
          pattern={languageDeterminer(GLOBAL.addNewProductView.pattern)}
          placeholder={languageDeterminer(LANGUAGE.signInView.inputPlaceholder)}
          autoComplete="given-name family-name"
          // minLength={GLOBAL.addNewProductView.input.minLength}
          // maxLength={GLOBAL.addNewProductView.input.maxLength}
          defaultValue={dbItem.description}
          className={s.input}
          onChange={handleDescriptionChange}
        />
      </section>
    </main>
  );
}
