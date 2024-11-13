const fn = require('../Utils/catchAsync');
const User = require('../Models/userModel');
const AppError = require('../Utils/appError');
const log = require('eslint-plugin-react/lib/util/log');
const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory');
const { Model } = require('mongoose');


const getAllUsers=fn(async (req,res,next)=>{

  const users = await User.find();

  res.status(200).json({
    status: 'success',
    items: users.length,
    data: {
      users
    }
  });
  next();
});

const filterUserData=(obj, ...allowedData)=> {
  let filteredData={};

  Object.keys(obj).forEach(el=>{
    console.log(filteredData);
    if(allowedData.includes(el)) filteredData[el]=obj[el];
  });
  return filteredData;

};

const modifyUserData=fn(async(req,res,next)=>{

   if (req.body.password || req.body.passwordConfirm) {
     return next(new AppError('You cannot update your password at this route!', 400));
   }

   const filteredData=filterUserData(req.body,'email','name');

   const updatedUser= await User.findByIdAndUpdate(req.user.id,filteredData,{
     runValidators:true,
     new:true
   });
  console.log(updatedUser);


   res.status(200).json({
     message:'success',
     data:{
       updatedUser
     }
   });


 });

const getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
};

const deleteMe=fn(async(req,res,next)=>{

  await User.findByIdAndUpdate(req.body.id,{isActive:false});

  res.status(200).json({
    message:'succes',
    data:null
  })
});

const getUser=getOne(User);
``
const createUser=createOne(User);

const modifyUser=updateOne(User);

const deleteUser=deleteOne(User);

 module.exports={getAllUsers,
   getUser,
   createUser,
   modifyUser,
   deleteUser,
   modifyUserData,
   deleteMe,
   getMe
 };