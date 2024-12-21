const path= require('path');
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
let cookieParser = require('cookie-parser');
const hpp=require('hpp');
const reviewRouter = require('./Routers/reviewRouter');
const viewRouter = require('./Routers/viewRouter');

app.set('view engine','pug');
app.set('views',path.join(__dirname,'View'));

app.use(express.static(path.join(__dirname,'public')));

app.use(helmet({ contentSecurityPolicy: false }));

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
app.use('/',viewRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);


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

