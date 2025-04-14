import React, { lazy, useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import {
  useGlobalState,
  useChangeGlobalState,
  updateMainHeight,
  updateOrders,
} from 'state';
import { fetchCollection } from 'api';
import {
  Container,
  AppBar,
  Footer,
  PublicRoute,
  PrivateRoute,
} from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import 'App.css';

const SignInView = lazy(() =>
  import('pages/SignInView' /* webpackChunkName: "SignInView" */),
);
const CategoriesView = lazy(() =>
  import('pages/CategoriesView' /* webpackChunkName: "CategoriesView" */),
);
const SpecificCategoryView = lazy(() =>
  import(
    'pages/SpecificCategoryView' /* webpackChunkName: "SpecificCategoryView" */
  ),
);
const ProductsView = lazy(() =>
  import('pages/ProductsView' /* webpackChunkName: "ProductsView" */),
);
const SpecificProductView = lazy(() =>
  import(
    'pages/SpecificProductView' /* webpackChunkName: "SpecificProductView" */
  ),
);
const AddNewProductView = lazy(() =>
  import('pages/AddNewProductView' /* webpackChunkName: "AddNewProductView" */),
);
const EditProductView = lazy(() =>
  import('pages/EditProductView' /* webpackChunkName: "EditProductView" */),
);
const RemovedProductsView = lazy(() =>
  import(
    'pages/RemovedProductsView' /* webpackChunkName: "RemovedProductsView" */
  ),
);
const RemovedSpecificProductView = lazy(() =>
  import(
    'pages/RemovedSpecificProductView' /* webpackChunkName: "RemovedSpecificProductView" */
  ),
);
const EditRemovedProductView = lazy(() =>
  import(
    'pages/EditRemovedProductView' /* webpackChunkName: "EditRemovedProductView" */
  ),
);
const OrdersView = lazy(() =>
  import('pages/OrdersView' /* webpackChunkName: "OrdersView" */),
);
const AboutView = lazy(() =>
  import('pages/AboutView' /* webpackChunkName: "AboutView" */),
);
const NotFoundView = lazy(() =>
  import('pages/NotFoundView' /* webpackChunkName: "NotFoundView" */),
);

export default function App() {
  const { orders } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [productsByCategoryOrTag, setProductsByCategoryOrTag] = useState([]);

  // FIXME: Во всём коде заменить getLanguage() ---> language
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    requestAnimationFrame(() => {
      const appHeight = window.innerHeight;

      const container = document.getElementById('container');
      const header = document.getElementById('header');
      const footer = document.getElementById('footer');

      if (!container || !header || !footer) return;

      const containerStyle = window.getComputedStyle(container);
      const containerPaddings =
        Number.parseInt(containerStyle.getPropertyValue('padding')) * 2;

      const headerStyle = window.getComputedStyle(header);
      const headerHeight =
        Number.parseInt(headerStyle.getPropertyValue('height')) +
        Number.parseInt(headerStyle.getPropertyValue('margin-bottom'));

      const footerStyle = window.getComputedStyle(footer);
      const footerHeight =
        Number.parseInt(footerStyle.getPropertyValue('margin-top')) +
        Number.parseInt(footerStyle.getPropertyValue('height'));

      // Container, header and footer subtracted from viewport height
      const computedHeight =
        appHeight - (containerPaddings + headerHeight + footerHeight);

      changeGlobalState(updateMainHeight, computedHeight);
    });
  }, [changeGlobalState]);

  useEffect(() => {
    fetchCollection('orders').then(orders => {
      orders.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateOrders, orders);
    });
  }, [changeGlobalState]);

  // FIXME: changeCount()???
  function changeCount(obj) {
    const setCount = item => {
      item.count = Number(obj.count);
      return item;
    };

    changeGlobalState(
      updateOrders,
      orders.map(product =>
        product._id === obj._id ? setCount(product) : product,
      ),
    );
  }

  return (
    <Container>
      <AppBar setDefaultsProducts={() => setProductsByCategoryOrTag([])} />

      <Suspense
        fallback={
          <Puff
            height="200"
            width="200"
            radius={1}
            color="#FF00BF"
            ariaLabel="puff-loading"
            wrapperStyle={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            wrapperClass=""
            visible={true}
          />
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/categories" />} />

          <Route
            path="/signin"
            element={
              <PublicRoute restricted>
                <SignInView />
              </PublicRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoriesView
                  setProductsByCategory={setProductsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/categories/:id"
            element={
              <PrivateRoute>
                <SpecificCategoryView
                  productsByCategoryOrTag={productsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsView
                  productsByCategoryOrTag={productsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <SpecificProductView
                  setProductsByTag={setProductsByCategoryOrTag}
                  changeSelectCount={changeCount}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/new"
            element={
              <PrivateRoute>
                <AddNewProductView />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <PrivateRoute>
                <EditProductView
                  setProductsByTag={setProductsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/removedProducts"
            element={
              <PrivateRoute>
                <RemovedProductsView
                  productsByCategoryOrTag={productsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/removedProducts/:id"
            element={
              <PrivateRoute>
                <RemovedSpecificProductView
                  setProductsByTag={setProductsByCategoryOrTag}
                  changeSelectCount={changeCount}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/removedProducts/edit/:id"
            element={
              <PrivateRoute>
                <EditRemovedProductView
                  setProductsByTag={setProductsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersView />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.messages)}
                  wave3D
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.notifications)}
                  waveReflection
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <AboutView text={languageDeterminer(LANGUAGE.titles.clients)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <PrivateRoute>
                <AboutView text={languageDeterminer(LANGUAGE.titles.reviews)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.statistics)}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.settings)}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <PublicRoute>
                <NotFoundView
                  message={languageDeterminer(LANGUAGE.notFoundView.pageTitle)}
                />
              </PublicRoute>
            }
          />
        </Routes>
      </Suspense>

      <Footer />

      <ToastContainer />
    </Container>
  );
}
