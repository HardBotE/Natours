const express = require('express');
const toursRouter = require('./Routers/tourRouter.js');
const userRouter = require('./Routers/userRouter.js');
const AppError = require('./Utils/appError.js');
const app = express();
const globalErrorHandler = require('./Controllers/errorController.js');

//Middleware!?!
app.use(express.json());

const port=3000;
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use(express.static(`${__dirname}/public`));


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, express };
