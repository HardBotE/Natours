//review/rating/createdAt/ref to tour/ref to user

const mongoose=require('mongoose');
const Tour=require('./tourModel');
const schema=new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    set:val=>Math.round(val*100)/100
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
    toJSON:{ virtuals : true},
    toObject:{ virtuals : true} }
);

schema.index({tour:1,user:1},{unique:true});

schema.statics.calcAverageRatings= async function(tourId){
  console.log(tourId);
  const stats=await this.aggregate([
    {
      $match:{tourRef:tourId}
    },
    {
      $group:{
        _id:`$tourRef`,
        noRating:{$sum:1},
        avgRating: {$avg:'$rating'}
      }
    }

  ]);
  console.log('Statisztikak');
  console.log(stats.length);


  if(stats.length>0)
  {
    console.log(stats[0]);

    await Tour.findByIdAndUpdate(tourId,{
      ratingsQuantity:stats[0].noRating,
      ratingsAverage:stats[0].avgRating
    });
  }else
  {
    await Tour.findByIdAndUpdate(tourId,{
      ratingsQuantity:0,
      ratingsQuality:0,
    })
  }

}


/*
schema.pre(/^find/,function(next){
  this.populate({
    path:'tourRef'
  });
  next();
});*/

schema.post('save',function(){
    this.constructor.calcAverageRatings(this.tourRef);
});

schema.pre(/^findOneAnd/,async function(next) {
  this.r = await this.findOne();
  console.log(this);
  next();
});
schema.post(/^findOneAnd/,async function() {

  await this.r.constructor.calcAverageRatings(this.r.tourRef)
});

schema.pre(/^find/,function(next){
  this.populate({
    path:'userRef'
  });
  next();
});

const Review=mongoose.model('Review',schema);

module.exports=Review;