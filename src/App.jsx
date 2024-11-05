import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
import 'api/baseUrl';
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
const AboutView = lazy(() =>
  import('pages/AboutView' /* webpackChunkName: "AboutView" */),
);
const PortfolioView = lazy(() =>
  import('pages/PortfolioView' /* webpackChunkName: "PortfolioView" */),
);
const CartView = lazy(() =>
  import('pages/CartView' /* webpackChunkName: "CartView" */),
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

  function addToCart(productToBeAdded) {
    const productDuplication = cart.filter(
      obj => obj._id === productToBeAdded._id,
    );

    if (productDuplication.length > 0) {
      toast.error(languageDeterminer(LANGUAGE.addingToCard.productDuplication));
      return;
    }

    toast.success(languageDeterminer(LANGUAGE.addingToCard.productAdded));
    changeGlobalState(updateCart, [...cart, productToBeAdded]);
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
        cart,
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
                  addToCart={addToCart}
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
                  addToCart={addToCart}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/about"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView text={languageDeterminer(LANGUAGE.titles.about)} />
              </PrivateRoute>
            }
          />

          <Route
            path="/contacts"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.contacts)}
                  wave3D
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/delivery"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.delivery)}
                  waveReflection
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <PrivateRoute redirectTo="/signin">
                <PortfolioView />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute redirectTo="/signin">
                <CartView
                  sending={sending}
                  changeSelectCount={changeCount}
                  onDeleteProduct={removeFromCart}
                  onSubmit={submitCart}
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
