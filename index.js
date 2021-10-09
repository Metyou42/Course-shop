require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const MongoSessons = require('connect-mongodb-session')(session);
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const compression = require('compression');

const homePage = require('./routes/home');
const addPage = require('./routes/add');
const coursesPage = require('./routes/courses');
const cardPage = require('./routes/card');
const ordersPage = require('./routes/orders');
const authPage = require('./routes/auth');
const profilePage = require('./routes/profile');
const notFound = require('./routes/notfound');

const variablesMiddleware = require('./middleware/variables');
const userToModels = require('./middleware/userToModels');
const fileMiddleware = require('./middleware/file');

const keys = require('./keys');

const app = express();

app.disable('x-powered-by');

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    ifCond(v1, v2, options) {
      if (v1.toString() === v2.toString()) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoSessons({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
  clear_interval: 3600,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: keys.SESSION_SECRE,
    resave: false,
    saveUninitialized: false,
    store,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 5),
  })
);

app.use(fileMiddleware.any());

app.use(csrf());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

app.use(variablesMiddleware);
app.use(userToModels);

app.use('/', homePage);
app.use('/add', addPage);
app.use('/courses', coursesPage);
app.use('/card', cardPage);
app.use('/orders', ordersPage);
app.use('/auth', authPage);
app.use('/profile', profilePage);
app.use('*', notFound);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

    app.listen(PORT, () => {
      console.log(`Server is runing on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
