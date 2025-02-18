import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateProducts,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import {
  fetchCategories,
  fetchProducts,
  fetchProduct,
  fetchTags,
  fetchLinks,
  addProductApi,
} from 'api';
import {
  Spinner,
  Button,
  Tags,
  Links,
  CountForm,
  Modal,
  Alert,
} from 'components';
import {
  getLanguage,
  getCategory,
  getTags,
  pageUp,
  uploadImageToStorage,
  deleteProduct,
} from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import icons from 'assets/icons.svg';
import s from './EditProductView.module.css';

export default function EditProductView({
  setProductsByTag,
  changeSelectCount,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mainHeight,
    language,
    categories,
    products,
    tagsDictionary,
    linksDictionary,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [draggable, setDraggable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const productId = location.pathname.slice(15, location.pathname.length);
  const savedProduct = products.filter(product => product._id === productId)[0];

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

  useEffect(() => {
    if (products.length > 0) {
      setProduct(savedProduct);
    } else {
      setLoading(true);

      fetchProduct(productId)
        .then(product => setProduct(product))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [productId, products.length, savedProduct]);

  useEffect(() => {
    const startImages = product?.images?.map(imageLink => ({
      // FIXME fileId
      fileId: '',
      src: imageLink,
    }));
    product?.images && setImages(startImages);
  }, [product]);

  useEffect(() => {
    if (!tagsDictionary) {
      fetchTags()
        .then(tagsDictionary =>
          changeGlobalState(updateTagsDictionary, tagsDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingTags,
            )}:\n${error}`,
          ),
        );
    }

    if (!linksDictionary) {
      fetchLinks()
        .then(linksDictionary =>
          changeGlobalState(updateLinksDictionary, linksDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingLinks,
            )}:\n${error}`,
          ),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (product.uaTitle || product.ruTitle) &&
      tagsDictionary &&
      linksDictionary
    ) {
      setTags(
        getTags(
          language === 'RU' ? product.ruTitle : product.uaTitle,
          tagsDictionary,
          'tags',
        ),
      );
      setLinks(
        getTags(
          language === 'RU' ? product.ruTitle : product.uaTitle,
          linksDictionary,
          'links',
        ),
      );
    }
  }, [language, product, tagsDictionary, linksDictionary]);

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
      img.src = window.URL.createObjectURL(files[i]);
      images.push(img);
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

  const cancelEditProduct = async () => {
    navigate(`/products/${productId}`);
  };

  const toggleAlert = () => {
    setShowAlert(!showAlert);
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
    if (!title) {
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

    let detailsCondition = true;
    for (let i = 0; i < details.length; i++) {
      if (details[i].attribute_name.length < 1) {
        toast.error('Не заповнене поле властивості подробиць товару!');
        detailsCondition = false;
        break;
      } else if (details[i].attribute_value.length < 1) {
        toast.error('Не заповнене поле значення подробиць товару!');
        detailsCondition = false;
        break;
      }
    }
    if (!detailsCondition) return;

    const productTimeStamp = Date.now().toString();

    const imagesLinks = [];
    const imagesIds = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const imageLink = await uploadImageToStorage(
          language,
          images[i].file,
          productTimeStamp,
        );

        imagesLinks.push(imageLink.url);
        imagesIds.push(imageLink.id);
      } catch (error) {
        toast.error(`Error of addImages(): ${error.message}`);
        break;
      }
    }

    const newProduct = {
      _id: productTimeStamp,
      title,
      uaTitle: title,
      category,
      description,
      images: imagesLinks,
      imagesIds,
      price,
      quantity,
      product_details: details,
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
  }

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="red" />}

      {!loading && error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      )}

      {!loading && !error && product && (
        <>
          <div className={s.row}>
            <div className={s.imagesSection}>
              <img
                src={
                  images.length > 0 ? images[mainImageIdx].src : imageNotFound
                }
                title={'Збільшити'}
                alt={title}
                className={s.mainImage}
                onClick={toggleModal}
              />

              <div className={s.additionalImagesBox}>
                {images.length > 0 &&
                  images.map((image, idx) => (
                    <div key={idx + image.src} className={s.additionalImageBar}>
                      <img
                        src={image.src}
                        alt={title}
                        className={s.additionalImage}
                        onDragStart={() => dragStart(idx)}
                        onDragOver={preventDefault}
                        onDrop={() => dropOfMovement(idx)}
                        onClick={() => setMainImageIdx(idx)}
                      />

                      <Button
                        title={'Видалити зображення товару'} // languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
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
                        title={'Додати зображення товару'} // languageDeterminer(LANGUAGE.productViews.сollapseButtonTitle)
                        className={s.addBtn}
                      >
                        <svg className={s.iconAdd}>
                          <use href={`${icons}#icon-attachment`}></use>
                        </svg>
                      </label>

                      <input
                        type="file"
                        id="fileElem"
                        accept="image/*"
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
                          {language === 'RU'
                            ? category.ruTitle
                            : category.uaTitle}
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

                  <div>
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

              {(tags.length > 0 || links.length > 0) && (
                <section className={s.linksSection}>
                  {tags.length > 0 && (
                    <div className={s.linksBox}>
                      <span className={s.statName}>
                        {languageDeterminer(LANGUAGE.productViews.tags)}
                      </span>

                      <Tags
                        tags={tags}
                        boxStyles={s.tagBox}
                        tagStyles={s.tag}
                        setProductsByTag={setProductsByTag}
                      />
                    </div>
                  )}

                  {links.length > 0 && (
                    <div className={s.linksBox}>
                      <span className={classNames(s.statName, s.googleLink)}>
                        {languageDeterminer(LANGUAGE.productViews.links)}
                      </span>

                      <Links
                        links={links}
                        boxStyles={s.linkBox}
                        linkStyles={s.link}
                      />

                      <span className={s.statName}>?</span>
                    </div>
                  )}
                </section>
              )}

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
            images: images.map(image => image.src),
          }}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}

      {showAlert && (
        <Alert
          callBack={() => deleteProduct(product, changeGlobalState, navigate)}
          closeAlert={toggleAlert}
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

EditProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
};
