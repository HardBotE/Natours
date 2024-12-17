const Tours=require('../Models/tourModel');
const catchAsync = require('../Utils/catchAsync');

const getOverview=catchAsync(async (req,res)=>{
  //Get All Tour Data
  const tours = await Tours.find();
  //Render Webpage

  //Render Webpage with Tour Data

  //megkeresi a base nevu pug templatet
  res.status(200).render('overview',{
    title:'All Tours',
    tours
  });

});



module.exports={getOverview,getTour}