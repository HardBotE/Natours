const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour=require('./../Models/tourModel');
const Booking=require('./../Models/bookingModel');
const catchAsync=require('./../Utils/catchAsync');
const AppError=require('./../Utils/appError');
const {deleteOne,createOne,updateOne,getOne,getAll}=require('./handlerFactory');

const getCheckOutSession=catchAsync(async (req,res,next)=>{

   //1) Get Booked Tour
  const tour=await Tour.findById(req.params.tourID);
  // 2) Create checkout session
  const session=await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode:'payment',
    success_url:`${req.protocol}://${req.headers.host}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
    cancel_url:`${req.protocol}://${req.headers.host}/tours/${tour.id}`,
    customer_email:req.user.email,
    client_reference_id:req.params.id,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100 // Az ár centben
        },
        quantity: 1
      }
    ]

  });
  console.log(session);

  res.status(200).json({
    status: 'success',
    session
  });

});

const createBookingCheckout =catchAsync(async (req,res,next)=>{

  //This is unsecure, will be reimplemented in the future.
  console.log('THIS IS THE REQ.QUERY');
  console.log(req.query);
  const {tour,user,price}=req.query;
  if(!user || !tour || !price){
    return next();
  }
  const BookKing = await Booking.create({tour,user,price});
  await Booking.create({tour,user,price});
  console.log(BookKing);

  res.redirect(req.originalUrl.split('?')[0]);
});

const createBooking=createOne(Booking);

const getBooking=getOne(Booking);

const deleteBooking=deleteOne(Booking);

const updateBooking=updateOne(Booking);

const getAllBooking=getAll(Booking);



module.exports={getCheckOutSession,createBookingCheckout,createBooking, getAllBooking,getBooking,deleteBooking,updateBooking };