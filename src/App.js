import { lazy, Suspense, useState, useEffect } from 'react';
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

const AboutView = lazy(() =>
  import('pages/AboutView' /* webpackChunkName: "AboutView" */),
);
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
    const appWidth = window.innerWidth;
    const appHeight = window.innerHeight;

    // Container, header and footer subtracted from viewport height
    const computedHeight =
      appWidth < 320
        ? appHeight - (10 + (appWidth / 1.124 + 5) + 43)
        : appWidth < 420
        ? appHeight - (12 + (appWidth / 1.387 + 6) + 47)
        : appWidth < 800
        ? appHeight - (14 + (appWidth / 4 + 7) + 50)
        : appWidth < 1024
        ? appHeight - (16 + (appWidth / 6.25 + 8) + 52)
        : appWidth < 1600
        ? appHeight - (20 + (appWidth / 7.238 + 10) + 57)
        : appHeight -
          (appWidth / 80 +
            (appWidth / 7.813 + appWidth / 160) +
            (appWidth / 53.333 + appWidth / 55.56));

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
      toast.error(languageDeterminer(LANGUAGE.productDuplication));
      return;
    }

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
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <PrivateRoute redirectTo="/signin">
                <AboutView
                  text={languageDeterminer(LANGUAGE.titles.portfolio)}
                />
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

        <Footer />
      </Suspense>

      <ToastContainer />
    </Container>
  );
}
