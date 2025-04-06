import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateRemovedProducts,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import {
  fetchCollection,
  fetchRemovedProduct,
  fetchTags,
  fetchLinks,
  deleteRemovedImagesApi,
  saveChangesRemovedProductApi,
} from 'api';
import { Spinner, Button, Tags, Links, Modal, Confirm } from 'components';
import {
  getLanguage,
  getTags,
  pageUp,
  uploadImageToStorage,
  deleteRemovedProduct,
} from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import icons from 'assets/icons.svg';
import s from './EditRemovedProductView.module.css';

export default function EditRemovedProductView({ setProductsByTag }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mainHeight,
    language,
    categories,
    removedProducts,
    tagsDictionary,
    linksDictionary,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [removedProduct, setRemovedProduct] = useState({});
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
  const [showConfirm, setShowConfirm] = useState(false);

  const removedProductId = location.pathname.slice(
    22,
    location.pathname.length,
  );
  const savedProduct = removedProducts.filter(
    removedProduct => removedProduct._id === removedProductId,
  )[0];

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

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

  useEffect(() => {
    if (removedProducts.length > 0) {
      setRemovedProduct(savedProduct);
    } else {
      setLoading(true);

      fetchRemovedProduct(removedProductId)
        .then(removedProduct => setRemovedProduct(removedProduct))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [removedProductId, removedProducts.length, savedProduct]);

  useEffect(() => {
    removedProduct?.images && setImages(removedProduct.images);
  }, [removedProduct]);

  useEffect(() => {
    if (removedProduct) {
      setCategory(removedProduct?.category ?? '');
      setTitle(propertyWrapper(language, removedProduct, 'title'));
      setDetails(
        propertyWrapper(language, removedProduct, 'product_details') ?? [],
      );
      setDescription(propertyWrapper(language, removedProduct, 'description'));
      setPrice(removedProduct?.price ?? 0.01);
      setQuantity(removedProduct?.quantity ?? 0);
    }
  }, [language, removedProduct]);

  useEffect(() => {
    if (!tagsDictionary) {
      fetchTags()
        .then(tagsDictionary =>
          changeGlobalState(updateTagsDictionary, tagsDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.tagsGetting,
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
              LANGUAGE.toastErrors.linksGetting,
            )}:\n${error}`,
          ),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      removedProduct?.title?.['ua' || 'ru' || 'en'] &&
      tagsDictionary &&
      linksDictionary
    ) {
      setTags(
        getTags(
          propertyWrapper(language, removedProduct, 'title'),
          tagsDictionary,
          'tags',
        ),
      );
      setLinks(
        getTags(
          propertyWrapper(language, removedProduct, 'title'),
          linksDictionary,
          'links',
        ),
      );
    }
  }, [language, removedProduct, tagsDictionary, linksDictionary]);

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

  const cancelEditRemovedProductHandler = async () => {
    navigate(`/removedProducts/${removedProductId}`);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
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
    const removedProductDetails = {
      attribute_name: '',
      attribute_value: '',
      timeStamp: Date.now().toString(),
    };

    setDetails(prevDeteils => [...prevDeteils, removedProductDetails]);
  }

  function deleteDetail(detail) {
    setDetails(prevDetails =>
      prevDetails.filter(
        removedProductDetail =>
          removedProductDetail.timeStamp !== detail.timeStamp,
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

  async function saveChangesRemovedProductHandler() {
    setLoading(true);

    if (!title) {
      setLoading(false);
      toast.error('Не заповнене поле назви товару!');
      return;
    } else if (!category) {
      setLoading(false);
      toast.error('Не вибране поле кагорії товару!');
      return;
    } else if (!description) {
      setLoading(false);
      toast.error('Не заповнене поле опису про товар!');
      return;
    } else if (!price) {
      setLoading(false);
      toast.error('Не вказана ціна товару!');
      return;
    } else if (!quantity) {
      setLoading(false);
      toast.error('Не вказана кількість товару!');
      return;
    }

    let detailsCondition = true;
    for (let i = 0; i < details.length; i++) {
      if (details[i].attribute_name.length < 1) {
        setLoading(false);
        toast.error('Не заповнене поле властивості подробиць товару!');
        detailsCondition = false;
        break;
      } else if (details[i].attribute_value.length < 1) {
        setLoading(false);
        toast.error('Не заповнене поле значення подробиць товару!');
        detailsCondition = false;
        break;
      }
    }
    if (!detailsCondition) return;

    const newImages = [];
    const imagesIds = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i].file) {
        try {
          const newImage = await uploadImageToStorage(
            language,
            images[i],
            removedProduct._id,
          );

          newImages.push(newImage);
          imagesIds.push(newImage.id);
        } catch (error) {
          setLoading(false);
          toast.error(
            `${languageDeterminer(LANGUAGE.toastErrors.imageUploading)}: ${
              error.message
            }`,
          );
          break;
        }
      } else {
        newImages.push(images[i]);
        imagesIds.push(images[i].id);
      }
    }

    const deletedImagesIds = removedProduct.images
      .filter(imageObj => !imagesIds.includes(imageObj.id))
      .map(imageObj => imageObj.id);

    await deleteRemovedImagesApi(deletedImagesIds, removedProduct._id, title);

    const newRemovedProduct = {
      _id: removedProduct._id,
      images: newImages,
      title: { ...removedProduct.title, [language.toLowerCase()]: title },
      category,
      product_details: {
        ...removedProduct.product_details,
        [language.toLowerCase()]: details,
      },
      price,
      quantity,
      description: {
        ...removedProduct.description,
        [language.toLowerCase()]: description,
      },
    };

    await saveChangesRemovedProductApi(newRemovedProduct, title);

    fetchCollection('removedProducts')
      .then(removedProducts => {
        removedProducts.sort(
          (firstRemovedProduct, secondRemovedProduct) =>
            secondRemovedProduct._id - firstRemovedProduct._id,
        );
        changeGlobalState(updateRemovedProducts, removedProducts);
        navigate(`/removedProducts/${newRemovedProduct._id}`);
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

      {!loading && error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>{languageDeterminer(removedProductId)}</p>
          <p className={s.errorText}>{removedProductId}</p>
        </div>
      )}

      {!loading && !error && removedProduct && (
        <>
          <div className={s.row}>
            <div className={s.imagesSection}>
              {images[mainImageIdx]?.type === 'video' ? (
                <video
                  src={images[mainImageIdx].url}
                  title={'Збільшити'} // FIXME
                  draggable="true"
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              ) : (
                <img
                  src={
                    images.length > 0 ? images[mainImageIdx].url : imageNotFound
                  }
                  title={'Збільшити'} // FIXME
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
                        title={'Видалити зображення товару'} // languageDeterminer(LANGUAGE.removedProductViews.сollapseButtonTitle)
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
                        title={'Додати зображення товару'} // languageDeterminer(LANGUAGE.removedProductViews.сollapseButtonTitle)
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
                    value={title}
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
                            value={detail.attribute_value}
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
                      defaultValue={removedProduct?.price ?? null}
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
                      defaultValue={removedProduct?.quantity ?? null}
                      className={s.countInput}
                      onKeyPress={keyPressHandler}
                      onChange={quantityChangeHandler}
                    />
                  </div>

                  <div className={s.buttonBox}>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.cancelButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={cancelEditRemovedProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.cancelButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.saveChangesButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={saveChangesRemovedProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.saveChangesButton.text,
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
                description={propertyWrapper(
                  language,
                  removedProduct,
                  'description',
                )}
                callback={descriptionChangeHandler}
              />
            </div>
          </div>

          <Description
            id="startDescription"
            languageDeterminer={languageDeterminer}
            style={s.startDescriptionSection}
            description={propertyWrapper(
              language,
              removedProduct,
              'description',
            )}
            callback={descriptionChangeHandler}
          />
        </>
      )}

      {showModal && (
        <Modal
          product={{
            title: { [language.toLowerCase()]: title },
            images,
          }}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}

      {showConfirm && (
        <Confirm
          callBack={() =>
            deleteRemovedProduct(
              removedProduct,
              title,
              changeGlobalState,
              navigate,
            )
          }
          closeConfirm={toggleConfirm}
        />
      )}
    </main>
  );
}

export function Description({
  id,
  languageDeterminer,
  style,
  description,
  callback,
}) {
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
        defaultValue={description}
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

EditRemovedProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
};
