const mongoose=require('mongoose');


//Tour Schema
const schema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'A tour must have a name'],
    unique: true
  },
  duration:{
    type:Number,
    required:[true,'A tour must have a date']
  },
  maxGroupSize:{
    type:Number
  },
  difficulty:{
    type:String,
    required:[true,'A tour must have a difficulty'],
    enum:{
      values:['easy','medium','difficult'],
      message:['Difficulty is either: easy, medium, or difficult']
    }
  },
  ratingsAverage:{
    type:Number,
    default:4.5,
    min:1,
    max:5
  },
  ratingsQuantity:{
    type:Number,
    default:0
  },
  price:{
    type:Number,
    required:[true,'A tour must have a price']
  },
  summary:{
    type:String,
    required:[true,'A tour must have a summary']
  },
  description:{
    type:String
  },
  imageCover:{
    type:String,
    required:[true,'A tour must have an image cover']
  },
  images: [String],
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false
  },
  startDates:{
    type:[Date]

  }

},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

schema.virtual('durationInWeeks').get(function(){
  return this.duration/7;
});

schema.pre('save',function(){
  console.log(this);
})

const Tour=mongoose.model('Tour',schema);

module.exports=Tour;
/*
testTour.save().then(doc=>{
  console.log(doc);
  console.log('Data saved');
}).catch(err =>{
  console.log('ERROR:',err);
});*/


