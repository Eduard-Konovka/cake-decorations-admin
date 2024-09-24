# Web application of a product online store

**_This is a commercial open source project. And it is in the development stage!
You can watch the development and improvement of this application in real time
😉_**

## A single-page web application of an online productstore

The application allows you to search for products by part of the title; filter a
selection of products by four price ranges or a certain price; sort products in
descending and ascending order by SKU (Stock Keeping Unit, article number,
identification number) or by price. On the page of a separate product, you can
use a thematic tag to go to the list of products with a topic corresponding to
the tag, so the application also implements sorting by thematic tags. On the
page of a separate product, there is additionally a link to the Google search
engine for the keywords of the product title. Both on the page of a separate
product and in the cart, the amount of the order of a particular product is
automatically calculated depending on the quantity, in addition, the total
amount of the order of all products and their quantity is calculated in the
cart. For convenience, in the cart, the transition from the cart to the page of
a separate product is additionally implemented.

The project is located
[cake-decorations-by-tetiana-chechina.netlify.app](https://cake-decorations-by-tetiana-chechina.netlify.app)

The web application is implemented according to the "Mobile First" strategy with
an adaptive-responsive layout with the following breakpoints:

- default value - for smartphones with a screen width of less than 320 px (in
  reality - 200...319 px);
- 320 px - for smartphones with a screen width of 320...419 px;
- 420 px - for smartphones and tablets with a screen width of 420...799 px;
- 800 px - for desktops and laptops with a screen width of 800...1023 px;
- 1024 px - for desktop computers and laptops with a screen width of 1024...1599
  px, or when using an auxiliary breakpoint - 1024...1199 px;
- 1200 px - auxiliary breakpoint for desktop computers and laptops with a screen
  width of 1200...1599 px;
- 1600 px - for desktop computers, laptops, TVs, projectors with a screen width
  of more than 1600 px.

The project was created using the "React" framework in combination with the
"Node.js" back end on the basis of a server on the "Express" framework connected
to the "MongoDB" database.

<!-- The web server project is located
[github.com/Eduard-Konovka/feb101-course-task-api](https://github.com/Eduard-Konovka/feb101-course-task-api).

## Application launch instructions

This app uses a back end server at
[feb101-course-task-api-eduard-konovka.onrender.com](https://feb101-course-task-api-eduard-konovka.onrender.com),
accordingly, the REACT_APP_URL environment variable corresponding to this
address is used as the base URL to access the API.

Unfortunately, due to the use of the free [Render](render.com) backend host for
educational purposes, there is a delay in the **_first_** loading of the product
list, so please,

**WAIT** **FOR** **THE** **FIRST** **LOAD** **OF** **THE** **BOOK** **LIST!**

For interaction with the backend, REST API with the following endpoints is used:

- The `/api/products` endpoint is used to get the list of products;
- The `/api/orders` endpoint is used to send orders.

The order is sent to the MongoDB database. I track orders using the MongoDB
Compass database application. Usually, in standard online stores, a mail client
is also configured, which automatically sends orders to the store owner by
e-mail. I also once had to implement this, but it goes beyond the scope of the
course project, so I omitted it for now. -->

## Script commands in console:

#### `npm start`

Runs the app in the development mode.\
Open [localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm run deploy`

Deploy development files to Netlify.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.
