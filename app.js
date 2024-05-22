/* const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

/* app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the other side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post');
}); */

/* const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Getting or reading(GET)
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
}); */

// Getting Data by id
// Method 1
/* app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const tour = tours.find((el) => el.id === id);
  
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
}); // comment closing here

// Method 2

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Posting or creating(POST)
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
});

// Updating Data(PATCHING)
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updating tour here...',
    },
  });
});


// Deleting Data(Delete)
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
}); */

// Refactoring my code

const express = require('express');

const morgan = require('morgan');

const app = express();

// MIDDLEWARES
// console.log(process.env.NODE_ENV);


if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`)); //serving static files

// CREATING A MIDDLEWARE

/* app.use((req, res, next) => {
  console.log('Just testing this middleware');
  next();
}); */

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
///////////////////////////////////////////////////////

// ROUTE HANDLERS
const tourRouter = require('./routes/tourRoutes');

// ROUTE HANDLER (USER)
const userRouter = require('./routes/userRoutes');

/* // Getting or reading(GET)
app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTour);

// Posting or creating(POST)
app.post('/api/v1/tours', createTour);

// Updating Data(PATCHING)
app.patch('/api/v1/tours/:id', updateTour);

// Deleting Data(Delete)
app.delete('/api/v1/tours/:id', deleteTour); */

// ROUTES

// USERS ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
