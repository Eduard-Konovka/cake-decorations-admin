import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateProducts,
} from 'state';
import { fetchCollection, addProductApi } from 'api';
import { Spinner, Button, Modal } from 'components';
import {
  getLanguage,
  setScrollPosition,
  uploadImageToStorage,
} from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import icons from 'assets/icons.svg';
import s from './AddNewProductView.module.css';

export default function AddNewProductView() {
  const navigate = useNavigate();
  const { mainHeight, language, categories } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [draggable, setDraggable] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(setScrollPosition, []);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCollection('categories')
        .then(categories => changeGlobalState(updateCategories, categories))
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.categoriesGetting,
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

  function preventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragenter(e) {
    preventDefault(e);
    setDraggable(true);
  }

  function dragleave(e) {
    // FIXME
    preventDefault(e);
    setDraggable(false);
  }

  const dragStart = index => {
    setDraggedImage(index);
  };

  function dropOfAdding(e) {
    preventDefault(e);
    setDraggable(false);

    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
  }

  const dropOfMovement = index => {
    const newImages = [...images];
    const draggedItem = newImages.splice(draggedImage, 1)[0];
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
  };

  async function handleFiles(files) {
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const img = {};
      img.file = files[i];
      img.type = files[i].type.slice(0, 5);
      img.url = window.URL.createObjectURL(files[i]);
      newImages.push(img);
    }

    setImages(prevImages => [...prevImages, ...newImages]);
  }

  async function addImages(event) {
    const files = event.target.files;

    handleFiles(files);
  }

  function deleteImage(idx) {
    setImages(prevImages => prevImages.filter((_, index) => index !== idx));
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  function titleChangHandler(event) {
    const value = event.target.value;
    setTitle(value);
  }

  function categoryChangeHandler(event) {
    const value = event.target.value;
    setCategory(value);
  }

  function descriptionChangeHandler(event) {
    const value = event.target.value;
    setDescription(value);
  }

  function addDetail() {
    const productDetails = {
      attribute_name: '',
      attribute_value: '',
      timeStamp: Date.now().toString(),
    };

    setDetails(prevDeteils => [...prevDeteils, productDetails]);
  }

  function deleteDetail(detail) {
    setDetails(prevDetails =>
      prevDetails.filter(
        productDetail => productDetail.timeStamp !== detail.timeStamp,
      ),
    );
  }

  function attributeNameChangeHandler(event, timeStamp) {
    const value = event.target.value;

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
    const value = event.target.value;

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

  async function addProduct() {
    setLoading(true);

    if (!title) {
      setLoading(false);
      toast.error('Не заповнене поле назви товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.titleInput)
      return;
    } else if (!category) {
      setLoading(false);
      toast.error('Не вибране поле кагорії товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.categoryInput)
      return;
    } else if (!description) {
      setLoading(false);
      toast.error('Не заповнене поле опису про товар!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.descriptionInput)
      return;
    } else if (!price) {
      setLoading(false);
      toast.error('Не вказана ціна товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.priceInput)
      return;
    } else if (!quantity) {
      setLoading(false);
      toast.error('Не вказана кількість товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.quantityInput)
      return;
    }

    let detailsCondition = true;
    for (let i = 0; i < details.length; i++) {
      if (details[i].attribute_name.length < 1) {
        setLoading(false);
        toast.error('Не заповнене поле властивості подробиць товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.attributeNameInput)
        detailsCondition = false;
        break;
      } else if (details[i].attribute_value.length < 1) {
        setLoading(false);
        toast.error('Не заповнене поле значення подробиць товару!'); // TODO: languageDeterminer(LANGUAGE.addNewProductView.attributeValueInput)
        detailsCondition = false;
        break;
      }
    }
    if (!detailsCondition) return;

    const productTimeStamp = Date.now().toString();

    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const newImage = await uploadImageToStorage(
          language,
          images[i],
          productTimeStamp,
        );

        newImages.push(newImage);
      } catch (error) {
        setLoading(false);
        toast.error(
          `${languageDeterminer(LANGUAGE.toastErrors.imageUploading)}: ${
            error.message
          }`,
        );
        break;
      }
    }

    const newProduct = {
      _id: productTimeStamp,
      images: newImages,
      title: { [language.toLowerCase()]: title },
      category,
      product_details: { [language.toLowerCase()]: details },
      price,
      quantity,
      description: { [language.toLowerCase()]: description },
    };

    await addProductApi(newProduct, title);

    fetchCollection('products')
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
            LANGUAGE.toastErrors.productsGetting,
          )}:\n${error}`,
        ),
      );
  }

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="red" />}

      {!loading && (
        <>
          <div className={s.row}>
            <div className={s.imagesSection}>
              {images[mainImageIdx]?.type === 'video' ? (
                <video
                  src={images[mainImageIdx].url}
                  title={'Збільшити'} // TODO: languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
                  draggable="true"
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              ) : (
                <img
                  src={
                    images.length > 0 ? images[mainImageIdx].url : imageNotFound
                  }
                  title={'Збільшити'} // TODO: languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
                  alt={title}
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              )}

              <div className={s.additionalImagesBox}>
                {images.length > 0 &&
                  images.map((image, idx) => (
                    <div key={idx + image.url} className={s.additionalImageBar}>
                      {image?.type === 'video' ? (
                        <video
                          src={image.url}
                          draggable="true"
                          className={s.additionalVideo}
                          onDragStart={() => dragStart(idx)}
                          onDragOver={preventDefault}
                          onDrop={() => dropOfMovement(idx)}
                          onClick={() => setMainImageIdx(idx)}
                        />
                      ) : (
                        <img
                          src={image.url}
                          alt={title}
                          className={s.additionalImage}
                          onDragStart={() => dragStart(idx)}
                          onDragOver={preventDefault}
                          onDrop={() => dropOfMovement(idx)}
                          onClick={() => setMainImageIdx(idx)}
                        />
                      )}

                      <Button
                        title={'Видалити світлину товару'} // TODO: languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
                        type="button"
                        typeForm="icon"
                        styles={s.iconCloseBtn}
                        onClick={() => deleteImage(idx)}
                      >
                        <svg className={s.iconClose}>
                          <use href={`${icons}#icon-close`}></use>
                        </svg>
                      </Button>
                    </div>
                  ))}

                <div
                  className={
                    draggable ? s.addImageBar_draggable : s.addImageBar
                  }
                  onDragEnter={dragenter}
                  onDragLeave={dragleave}
                  onDragOver={preventDefault}
                  onDrop={dropOfAdding}
                >
                  {!draggable && (
                    <>
                      <label
                        htmlFor="fileElem"
                        title={'Додати зображення товару'} // TODO: languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
                        className={s.addBtn}
                      >
                        <svg className={s.iconAdd}>
                          <use href={`${icons}#icon-attachment`}></use>
                        </svg>
                      </label>

                      <input
                        type="file"
                        id="fileElem"
                        accept="image/* video/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={addImages}
                      />
                    </>
                  )}
                </div>
              </div>
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
                      LANGUAGE.addNewProductView.placeholders.title,
                    )}
                    autoComplete="given-name family-name"
                    minLength={GLOBAL.inputs.common.minLength}
                    maxLength={GLOBAL.inputs.common.maxLength}
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
                      value={category}
                      className={s.select}
                      onChange={categoryChangeHandler}
                    >
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {propertyWrapper(language, category, 'title')}
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
                              GLOBAL.inputs.common.pattern,
                            )}
                            placeholder={languageDeterminer(
                              LANGUAGE.addNewProductView.placeholders
                                .attributeName,
                            )}
                            autoComplete="given-name family-name"
                            minLength={GLOBAL.inputs.common.minLength}
                            // maxLength={GLOBAL.inputs.common.maxLength}
                            value={detail.attribute_name}
                            className={s.input}
                            onChange={event =>
                              attributeNameChangeHandler(
                                event,
                                detail.timeStamp,
                              )
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
                              GLOBAL.inputs.common.pattern,
                            )}
                            placeholder={languageDeterminer(
                              LANGUAGE.addNewProductView.placeholders
                                .attributeValue,
                            )}
                            autoComplete="given-name family-name"
                            minLength={GLOBAL.inputs.common.minLength}
                            // maxLength={GLOBAL.inputs.common.maxLength}
                            className={s.input}
                            onChange={event =>
                              attributeValueChangeHandler(
                                event,
                                detail.timeStamp,
                              )
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

                  <div className={s.buttonBox}>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.saveButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={addProduct}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.saveButton.text,
                      )}
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
        </>
      )}

      {showModal && (
        <Modal
          product={{
            title,
            images,
          }}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}
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
        placeholder={languageDeterminer(
          LANGUAGE.addNewProductView.placeholders.description,
        )}
        autoComplete="given-name family-name"
        minLength={GLOBAL.inputs.common.minLength}
        // maxLength={GLOBAL.inputs.common.maxLength}
        autoCorrect="on"
        className={s.textarea}
        onChange={callback}
      />
    </form>
  );
}
