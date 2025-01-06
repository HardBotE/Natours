const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const { APIFeatures } = require('../Utils/APIFeatures');
const Tour = require('../Models/tourModel');



const deleteOne=Model=>catchAsync(async(req,res,next)=> {
  const document =await Model.findByIdAndDelete(req.params.id);
  if(!document) {
    return next(new AppError('No document found with that ID'),404);
  }
  res.status(200).json({
    status: 'successfully deleted',
    data:null
  });
});

const createOne=Model=>catchAsync( async (req, res,next) => {
  console.log(req.body);
  const doc = await Model.create(req.body);
  doc.id=doc._id.toString();
  res.status(201).json({
    status: 'success',
    data: {
      doc
    }
  });
});

const updateOne=Model => catchAsync(async (req, res,next) => {

  const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if(!data)
  {
    return next(new AppError('No tour found with that ID',404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });

});

const getOne=((Model,popOptions=null)=>catchAsync(async (req,res,next)=>{
  let query=Model.findById(req.params.id);
  if(popOptions) query=query.populate(popOptions);
  const doc = await query;

  if(!doc) return next (new AppError('No document with that ID',404));

  res.status(200).json({
    status:'successful',
    data:{
      doc
    }
  });

}));

const getAll=(Model)=>catchAsync(async (req,res,next)=>{
  let filter={};
  if(req.params.id) filter={tourRef:req.params.id};

  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .paginate();
  /*const doc=await features.query.explain();*/
  const data = await features.query;

  res.status(200).json({
    status: 'success',
    items: data.length,
    data
  });
})

module.exports={deleteOne,createOne,updateOne,getOne,getAll};