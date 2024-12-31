import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import { sendСart } from 'api';
import {
  useGlobalState,
  useChangeGlobalState,
  updateMainHeight,
  updateCart,
} from 'state';
import {
  Container,
  AppBar,
  Footer,
  PublicRoute,
  PrivateRoute,
} from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import 'App.css';

const CategoriesView = lazy(() =>
  import('pages/CategoriesView' /* webpackChunkName: "CategoriesView" */),
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
const OrdersView = lazy(() =>
  import('pages/OrdersView' /* webpackChunkName: "OrdersView" */),
);
const AboutView = lazy(() =>
  import('pages/AboutView' /* webpackChunkName: "AboutView" */),
);
const SignInView = lazy(() =>
  import('pages/SignInView' /* webpackChunkName: "SignInView" */),
);
const NotFoundView = lazy(() =>
  import('pages/NotFoundView' /* webpackChunkName: "NotFoundView" */),
);

export default function App() {
  const { user, cart } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [productsByCategoryOrTag, setProductsByCategoryOrTag] = useState([]);
  const [sending, setSending] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    const appHeight = window.innerHeight;

    const container = document.getElementById('container');
    const containerStyle = window.getComputedStyle(container);
    const containerPaddings =
      Number.parseInt(containerStyle.getPropertyValue('padding')) * 2;

    const header = document.getElementById('header');
    const headerStyle = window.getComputedStyle(header);
    const headerHeight =
      Number.parseInt(headerStyle.getPropertyValue('height')) +
      Number.parseInt(headerStyle.getPropertyValue('margin-bottom'));

    const footer = document.getElementById('footer');
    const footerStyle = window.getComputedStyle(footer);
    const footerHeight =
      Number.parseInt(footerStyle.getPropertyValue('margin-top')) +
      Number.parseInt(footerStyle.getPropertyValue('height'));

    // Container, header and footer subtracted from viewport height
    const computedHeight =
      appHeight - (containerPaddings + headerHeight + footerHeight);

    changeGlobalState(updateMainHeight, computedHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeCount(obj) {
    const setCount = item => {
      item.count = Number(obj.count);
      return item;
    };

    changeGlobalState(
      updateCart,
      cart.map(product =>
        product._id === obj._id ? setCount(product) : product,
      ),
    );
  }

  function removeFromCart(_id) {
    const newCart = cart.filter(obj => obj._id !== _id);
    changeGlobalState(updateCart, newCart);
  }

  function submitCart(totalCost) {
    setSending(true);

    setTimeout(() => {
      sendСart({
        user,
        cart: cart.map(obj => ({ _id: obj._id, quantity: obj.count })),
        totalCost,
      }).finally(() => {
        changeGlobalState(updateCart, []);
        setSending(false);
      });
    }, GLOBAL.sending);
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
          <Route path="/" element={<Navigate to="/signin" />} />

          <Route
            path="/signin"
            element={
              <PublicRoute redirectTo="/categories" restricted>
                <SignInView />
              </PublicRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute redirectTo="/signin">
                <CategoriesView
                  setProductsByCategory={setProductsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute redirectTo="/signin">
                <ProductsView
                  productsByCategoryOrTag={productsByCategoryOrTag}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <PrivateRoute redirectTo="/signin">
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
              <PrivateRoute redirectTo="/signin">
                <AddNewProductView />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <PrivateRoute redirectTo="/signin">
                <EditProductView
                  setProductsByTag={setProductsByCategoryOrTag}
                  changeSelectCount={changeCount}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/deleted"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView text={languageDeterminer(LANGUAGE.titles.deleted)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute redirectTo="/signin">
                <OrdersView
                  sending={sending}
                  changeSelectCount={changeCount}
                  onDeleteProduct={removeFromCart}
                  onSubmit={submitCart}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute redirectTo="/signin">
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
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.notifications)}
                  waveReflection
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/promotions"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.promotions)}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView text={languageDeterminer(LANGUAGE.titles.clients)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView text={languageDeterminer(LANGUAGE.titles.reviews)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/statistics"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.statistics)}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <PrivateRoute redirectTo="/signin">
                <NotFoundView
                  message={languageDeterminer(LANGUAGE.notFoundView)}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>

      <Footer />

      <ToastContainer />
    </Container>
  );
}
