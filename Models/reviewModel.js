//review/rating/createdAt/ref to tour/ref to user

const mongoose=require('mongoose');

const schema=new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tourRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  userRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }

}
,{
    toJSON:{virtuals:true},
    toObject:{virtuals:true} }
);
/*
schema.pre(/^find/,function(next){
  this.populate({
    path:'tourRef'
  });
  next();
});*/
schema.pre(/^find/,function(next){
  this.populate({
    path:'userRef'
  });
  next();
});

const Review=mongoose.model('Review',schema);

module.exports=Review;