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
      message:'Difficulty is either: easy, medium, or difficult'
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
  },
  startLocation:{
    //GeoJSON
    type:{
      type:String,
      default:'Point',
      enum:['Point']
    },
    //longitude-latitude(vertical-horizontal)
    coordinates:[Number],
    address:String,
    description:String
  },
  locations:[
    {
      type:{
        type:String,
        default:'Point',
        enum:['Point'],
      },
      coordinates:[Number],
      address:String,
      description:String,
      day:Number

    }
  ],
  guides:[{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }],

},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

schema.index({price:1,ratingsAverage:-1})
schema.index({slug:1})
schema.virtual('reviews',{
  ref:'Review',
  foreignField:'tourRef',
  localField:'_id'
});
schema.index({startLocation:'2dsphere'});
schema.virtual('durationInWeeks').get(function(){
  return this.duration/7;
});
/*
schema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt'
  });
  next();
});*/

schema.pre('save',function(){
  console.log(this);
});



/*Beagyazas
schema.pre('save',async function(next){
  const guidesPromise=await this.guides.map( async id => await User.findById(id));
  this.guides=await Promise.all(guidesPromise);
  next();
});
*/
const Tour=mongoose.model('Tour',schema);

module.exports=Tour;
/*
testTour.save().then(doc=>{
  console.log(doc);
  console.log('Data saved');
}).catch(err =>{
  console.log('ERROR:',err);
});*/


