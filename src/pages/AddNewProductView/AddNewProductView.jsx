import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateProducts,
} from 'state';
import { fetchCategories, fetchProducts, addProductApi } from 'api';
import { Button } from 'components';
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
  const { mainHeight, language, categories } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
        .then(categories => changeGlobalState(updateCategories, categories))
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingCategories,
            )}:\n${error}`,
          ),
        );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [category, categories]);

  const titleChangHandler = event => {
    const value = event.target.value.trim();
    setName(value);
  };

  const categoryChangeHandler = event => {
    const value = event.target.value.trim();
    setCategory(value);
  };

  const descriptionChangeHandler = event => {
    const value = event.target.value.trim();
    setDescription(value);
  };

  const addDetail = () => {
    const productDetails = {
      attribute_name: '',
      attribute_value: '',
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

  function attributeNameChangeHandler(event, timeStamp) {
    const value = event.target.value.trim();

    setDetails(prevDeteils => {
      const editableDetails = prevDeteils.map(detail => {
        if (detail.timeStamp === timeStamp) {
          detail.attribute_name = value;
        }

        return detail;
      });

      return editableDetails;
    });
  }

  function attributeValueChangeHandler(event, timeStamp) {
    const value = event.target.value.trim();

    setDetails(prevDeteils => {
      const editableDetails = prevDeteils.map(detail => {
        if (detail.timeStamp === timeStamp) {
          detail.attribute_value = value;
        }

        return detail;
      });

      return editableDetails;
    });
  }

  function priceKeyPressChangeHandler(event) {
    if (
      GLOBAL.keyСodes.prohibitedForPrice.includes(event.charCode) ||
      (event.charCode === GLOBAL.keyСodes.zero && !event.target.value)
    ) {
      event.preventDefault();
    }
  }

  function keyPressHandler(event) {
    if (
      GLOBAL.keyСodes.prohibited.includes(event.charCode) ||
      (event.charCode === GLOBAL.keyСodes.zero && !event.target.value)
    ) {
      event.preventDefault();
    }
  }

  function priceChangeHandler(event) {
    const inputValue = Number(event.target.value);

    if (inputValue >= 0.01) {
      setPrice(inputValue);
    } else {
      toast.error(
        `${languageDeterminer(
          LANGUAGE.countForm.error.prefix,
        )} ${0.01} ${languageDeterminer(
          LANGUAGE.countForm.error.suffix,
        )} ${languageDeterminer(LANGUAGE.countForm.error.postfix)}`,
      );
    }
  }

  function quantityChangeHandler(event) {
    const inputValue = Number(event.target.value);

    if (inputValue >= 1 && Number.isInteger(inputValue)) {
      setQuantity(inputValue);
    } else {
      toast.error(
        `${languageDeterminer(
          LANGUAGE.countForm.error.prefix,
        )} ${1} ${languageDeterminer(
          LANGUAGE.countForm.error.suffix,
        )} ${languageDeterminer(LANGUAGE.countForm.error.postfix)}`,
      );
    }
  }

  const addProductHandler = async () => {
    if (!name) {
      toast.error('Не заповнене поле назви товару!');
      return;
    } else if (!category) {
      toast.error('Не вибране поле кагорії товару!');
      return;
    } else if (!description) {
      toast.error('Не заповнене поле опису про товар!');
      return;
    } else if (!price) {
      toast.error('Не вказана ціна товару!');
      return;
    } else if (!quantity) {
      toast.error('Не вказана кількість товару!');
      return;
    }

    const newProduct = {
      _id: Date.now().toString(),
      title: name,
      uaTitle: name,
      category,
      description,
      images: dbItem.images,
      price,
      quantity,
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
        <div className={s.imagesSection}>
          <img
            src={imageNotFound}
            title={'aaaaaaaaaaaa'}
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
        </div>

        <div className={s.thumb}>
          <div className={s.monitor}>
            <form className={s.statsSection}>
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
                autoCorrect="on"
                className={s.titleInput}
                onChange={titleChangHandler}
              />

              <div className={s.stat}>
                <label htmlFor="category" className={s.statName}>
                  {languageDeterminer(LANGUAGE.productViews.category)}
                </label>

                <select
                  id="category"
                  name="category"
                  title={languageDeterminer(
                    LANGUAGE.addNewProductView.titleInput,
                  )}
                  defaultValue={category || null}
                  className={s.select}
                  onChange={categoryChangeHandler}
                >
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {language === 'RU' ? category.ruTitle : category.uaTitle}
                    </option>
                  ))}
                </select>
              </div>

              {details.length > 0 &&
                details.map(detail => (
                  <div key={detail.timeStamp} className={s.detailsStat}>
                    <div className={s.detail}>
                      <label
                        htmlFor={`attributeName${detail.timeStamp}`}
                        className={s.statName}
                      >
                        {'Властивість: '}
                      </label>

                      <input
                        id={`attributeName${detail.timeStamp}`}
                        name={`attributeName${detail.timeStamp}`}
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
                        value={detail.attribute_name}
                        className={s.input}
                        onChange={event =>
                          attributeNameChangeHandler(event, detail.timeStamp)
                        }
                      />
                    </div>

                    <div className={s.detail}>
                      <label
                        htmlFor={`attributeValue${detail.timeStamp}`}
                        className={s.statName}
                      >
                        {'Значення: '}
                      </label>

                      <input
                        id={`attributeValue${detail.timeStamp}`}
                        name={`attributeValue${detail.timeStamp}`}
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
                        className={s.input}
                        onChange={event =>
                          attributeValueChangeHandler(event, detail.timeStamp)
                        }
                      />
                    </div>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.addButton.title,
                      )}
                      type="button"
                      onClick={() => deleteDetail(detail)}
                    >
                      {'Видалити властивість'}
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

            <form className={s.controlsSection}>
              <div className={s.controlsRow}>
                <label htmlFor="price" className={s.boldfont}>
                  {languageDeterminer(LANGUAGE.addProductViews.price)}
                </label>

                <input
                  name="price"
                  id="price"
                  type="number"
                  min={0.01}
                  step={0.01}
                  placeholder={0.01}
                  className={s.countInput}
                  onKeyPress={priceKeyPressChangeHandler}
                  onChange={priceChangeHandler}
                />
              </div>

              <div className={s.controlsRow}>
                <label htmlFor="quantity" className={s.boldfont}>
                  {languageDeterminer(LANGUAGE.countForm.label)}
                </label>

                <input
                  name="quantity"
                  id="quantity"
                  type="number"
                  min={1}
                  placeholder={0}
                  className={s.countInput}
                  onKeyPress={keyPressHandler}
                  onChange={quantityChangeHandler}
                />
              </div>

              <div>
                <Button
                  title={languageDeterminer(
                    LANGUAGE.productViews.saveButton.title,
                  )}
                  type="button"
                  styles={s.btn}
                  onClick={addProductHandler}
                >
                  {languageDeterminer(LANGUAGE.productViews.saveButton.text)}
                </Button>
              </div>
            </form>
          </div>

          <Description
            id="finishDescription"
            languageDeterminer={languageDeterminer}
            style={s.finishDescriptionSection}
            callback={descriptionChangeHandler}
          />
        </div>
      </div>

      <Description
        id="startDescription"
        languageDeterminer={languageDeterminer}
        style={s.startDescriptionSection}
        callback={descriptionChangeHandler}
      />
    </main>
  );
}

export function Description({ id, languageDeterminer, style, callback }) {
  return (
    <form className={style}>
      <label htmlFor={id} className={s.statName}>
        {'Опис товару: '}
      </label>

      <textarea
        id={id}
        name={id}
        rows="10"
        title={languageDeterminer(LANGUAGE.addNewProductView.titleInput)}
        placeholder={languageDeterminer(LANGUAGE.signInView.inputPlaceholder)}
        autoComplete="given-name family-name"
        minLength={GLOBAL.addNewProductView.input.minLength}
        // maxLength={GLOBAL.addNewProductView.input.maxLength}
        autoCorrect="on"
        className={s.textarea}
        onChange={callback}
      />
    </form>
  );
}
