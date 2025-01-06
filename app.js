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
const bookingRouter=require('./Routers/bookingRouter.js');
const viewRouter = require('./Routers/viewRouter');
const toursRouter = require('./Routers/tourRouter.js');
const userRouter = require('./Routers/userRouter.js');

const cookieParser = require('cookie-parser');
const { extend } = require('express-csp');

const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],// Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
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
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(helmet());

extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://js.stripe.com/v3/',
        'https://unpkg.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:8828',
        'ws://localhost:56558/',
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com/*',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:3000/*',
        'ws://127.0.0.1:3000/*',
        'wss://localhost:3000/*',
        'wss://127.0.0.1:3000/*',
        'ws://localhost:*',
      ],
    },
  },
});


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
app.use('/api/v1/booking',bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, express };

