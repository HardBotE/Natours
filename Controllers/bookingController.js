const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour=require('./../Models/tourModel');
const catchAsync=require('./../Utils/catchAsync');
const AppError=require('./../Utils/appError');


const getCheckOutSession=catchAsync(async (req,res,next)=>{

   //1) Get Booked Tour
  console.log(req.params);
  const tour=await Tour.findById(req.params.tourID);
  console.log(tour);
  console.log(req.protocol);
  // 2) Create checkout session
  const session=await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode:'payment',
    success_url:`${req.protocol}://${req.headers.host}`,
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

module.exports={getCheckOutSession};