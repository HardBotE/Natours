const path= require('path');
const express = require('express');

const AppError = require('./Utils/appError.js');

const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const globalErrorHandler = require('./Controllers/errorController.js');

const reviewRouter = require('./Routers/reviewRouter');
const viewRouter = require('./Routers/viewRouter');
const toursRouter = require('./Routers/tourRouter.js');
const userRouter = require('./Routers/userRouter.js');

const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],// Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE', // Adjust the methods as needed
  allowedHeaders: 'Content-Type, Authorization', // Adjust headers if needed
  credentials: true, // If you're using cookies or authentication
}));

app.set('view engine','pug');
app.set('views',path.join(__dirname,'View'));

app.use(express.static(path.join(__dirname,'public')));



//Max json data limit
app.use(express.json({limit:'10kb'}));

app.use(cookieParser());

app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://cdnjs.cloudflare.com', // Axios CDN helye
  'https://cdn.jsdelivr.net', // Axios alternatív helye
  'https://*.mapbox.com',
  'https://js.stripe.com',
  'https://m.stripe.network',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com/',
  'https://*.mapbox.com',
  'https://bundle.js:*',
  'ws://localhost:*/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


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



app.use((req, res, next)=>{
  req.requestTime=new Date().toISOString();
  console.log('REQUEST COOKIE');
  console.log(req.cookies.jwt);
  next();
});

app.use('/',viewRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, express };

