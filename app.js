
const express = require('express');
const toursRouter = require('./Routers/tourRouter.js');
const userRouter = require('./Routers/userRouter.js');
const AppError = require('./Utils/appError.js');
const app = express();
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const globalErrorHandler = require('./Controllers/errorController.js');
var cookieParser = require('cookie-parser');
const hpp=require('hpp');
const reviewRouter = require('./Routers/reviewRouter');

app.use(helmet());

//Max json data limit
app.use(express.json({limit:'10kb'}));


app.use(cookieParser());

const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests try again later!'
});

//DDOS protection
app.use('/api',limiter);

//INJECTION PROTECTION
app.use(mongoSanitize());

//Data Sanitization
app.use(xss());

//prevent parameter pollution whi
app.use(hpp({
  whitelist:['duration','difficulty','price','ratingsAverage','ratingsQuantity','maxGroupSize']
}));

//HTTP header defence
app.use(helmet())

//ROUTES
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next)=>{
  req.requestTime=new Date().toISOString();
  console.log(req.headers);
  next();
});


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, express };
=======
const express=require('express');
const fs=require('fs');
const app=express();

//Middleware!?!
app.use(express.json());

const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

const port=3000;

app.get('/api/v1/tours',(req, res) => {
  res.status(200).json({
    status:'success',
    data:{
      tours
    }
  });

});

app.post('/api/v1/tours',(req, res)=>{
  console.log(req.body);

  const newId =tours.length;
  const newTour=Object.assign({},{id:newId},req.body);

  tours.push(newTour);
  console.log(tours);
  fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours),err => {

  });
  res.send('Done');
});

app.listen(port,()=>{
  console.log((`Welcome from the ${port} port`));
});
