const mongoose = require('mongoose');

const bookingSchema=new mongoose.Schema({
  tour:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tour',
    required:[true,'Booking is required']
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'User is required']
  },
  price:{
    type:Number,
    required:[true,'Price is required']
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  paid:{
    type: Boolean,
    default: true
  }

});

bookingSchema.pre('/^find/',function(next){
  this.populate('user').populate({
    path: 'tour',
    select:'name'
  });
  next();
})

const Booking=mongoose.model('Booking',bookingSchema);

module.exports=Booking;