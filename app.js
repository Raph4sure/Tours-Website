const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');


const { contentSecurityPolicy } = require('helmet');
// const livereload = require('livereload');
// const connectLivereload = require('connect-livereload');

// const browserSync = require('browser-sync');
// const browserSync = require('browser-sync').create();
// const browserSyncConfig = require('./bs-config');

const publicDirectory = path.join(__dirname, 'public');
/* 
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
 */

const app = express();

// // BrowserSync setup
// const bsConfig = require('./bs-config');
// browserSync.init(bsConfig);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   browserSync.reload();
// });

// LiveReload middleware
// app.use(connectLivereload());

// using PUG as Template engine

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(publicDirectory));

// Set security HTTP headers
app.use(helmet());
app.use(
  contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://api.mapbox.com', 'blob:', "'self'"],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com'
      ]
    }
  })
);


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//  Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// To Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src  'self' api.mapbox.com",
//     "script-src-elem 'self' api.mapbox.com"
//   );
//   next();
// });


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;




// const path = require('path');
// const express = require('express');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const viewRouter = require('./routes/viewRoutes');
// const livereload = require('livereload');
// const connectLivereload = require('connect-livereload');
// const browserSync = require('browser-sync').create();
// const publicDirectory = path.join(__dirname, 'public');

// // LiveReload setup
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(publicDirectory);
// liveReloadServer.server.once('connection', () => {
//   setTimeout(() => {
//     liveReloadServer.refresh('/');
//   }, 100);
// });

// const app = express();

// // BrowserSync setup
// browserSync.init({
//   proxy: 'localhost:3000',
//   files: ['views/**/*.pug', 'public/**/*.*'],
//   ignore: ['node_modules'],
//   reloadDelay: 500,
//   notify: false
// });

// // LiveReload middleware
// app.use(connectLivereload());

// // Setting up Pug as template engine
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// // 1) GLOBAL MIDDLEWARES
// // Serving static files
// app.use(express.static(publicDirectory));

// // Set security HTTP headers
// app.use(helmet());

// // Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Limit requests from same API
// const limiter = rateLimit({
//   max: 120,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour'
// });
// app.use('/api', limiter);

// // Body parser, reading data from body into req.body
// app.use(express.json({ limit: '10kb' }));

// // Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// // To test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// // 3) ROUTES
// app.use('/', viewRouter);
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

// module.exports = app;


// const path = require('path');
// const express = require('express');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const viewRouter = require('./routes/viewRoutes');
// const browserSync = require('browser-sync').create();
// const publicDirectory = path.join(__dirname, 'public');

// // Initialize BrowserSync
// const startBrowserSync = () => {
//   browserSync.init({
//     proxy: 'http://localhost:3000',
//     files: ['views/**/*.pug', 'public/**/*.*'],
//     ignore: ['node_modules'],
//     reloadDelay: 500,
//     notify: false
//   });
// };

// const app = express();

// // Start BrowserSync
// if (process.env.NODE_ENV === 'development') {
//   startBrowserSync();
// }

// // Setting up Pug as template engine
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// // 1) GLOBAL MIDDLEWARES
// // Serving static files
// app.use(express.static(publicDirectory));

// // Set security HTTP headers
// app.use(helmet());

// // Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Limit requests from same API
// const limiter = rateLimit({
//   max: 120,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour'
// });
// app.use('/api', limiter);

// // Body parser, reading data from body into req.body
// app.use(express.json({ limit: '10kb' }));

// // Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// // To test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// // 3) ROUTES
// app.use('/', viewRouter);
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

// module.exports = app;

/* 
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const publicDirectory = path.join(__dirname, 'public');

const app = express();

// Setting up Pug as template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
app.use(express.static(publicDirectory));
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
 */