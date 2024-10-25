const fn=require('../Utils/catchAsync');
const User=require('../Models/userModel');
const jwt=require('jsonwebtoken');
const AppError = require('../Utils/appError');
const { application } = require('express');
const {promisify}=require('util');

const signJWT=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});
}

const signUpUser=fn(async(req,res,next)=>{
  const newUser=await  User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
    passwordChangedAt:req.body.passwordChangedAt ||null
  });

  const token=signJWT(newUser._id);

  res.status(201).json({
    message:'Successfully Created New User',
    token:token,
    data:{user:newUser}
  });
});



const loginUser=fn(async (req,res,next)=>{

  const {email,password}=req.body;

  if(!email||!password) next(new AppError('Please provide email and password!'),400);

  const user=await User.findOne({email}).select('+password').select('+passwordChangedAt');


  if(!user ||! await user.isPasswordCorrect(password,user.password)){
    return next(new AppError('Invalid email or password',401));
  }

  const token=signJWT(user._id);
  res.status(200).json({
    status:'success',
    token
  });
});

const loggedIn=fn(async (req,res,next)=>{

  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(" ")[1];
  }

  if(!token) next(new AppError('You are not logged in. Login to get access.',401));


  const data=await promisify(jwt.verify)(token,process.env.JWT_SECRET);


  const loggedInUser= await User.findById(data.id).select('+passwordChangedAt');

  console.log(loggedInUser);

  if(!loggedInUser) next(new AppError('The user was deleted'),401);


  if(loggedInUser.isPasswordChanged(data.exp)) next(new AppError('The password was changed in the meantime',401));


  next();
});
module.exports={signUpUser,loginUser,loggedIn};