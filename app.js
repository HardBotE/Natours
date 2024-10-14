const express=require('express');
const toursRouter=require('./Routers/tourRouter.js');
const userRouter=require('./Routers/userRouter.js');

const app=express();

//Middleware!?!
app.use(express.json());

const port=3000;
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next();
});

module.exports={app,express};