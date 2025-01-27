const fn=require('../Utils/catchAsync');
const User=require('../Models/userModel');
const jwt=require('jsonwebtoken');
const AppError = require('../Utils/appError');
const { application } = require('express');
const {promisify}=require('util');
const {sendMailer, Email }=require('../Utils/email');
const crypto=require('crypto');

const signJWT=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});
}

const createSendToken=(user,statusCode,res)=>{

  const token=signJWT(user._id);

  const cookieSettings={
    expire: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24 *60 *60 *1000),
    httpOnly:true
  };

  if(process.env.NODE_ENV==="production") cookieSettings.SECURE=true;

  res.cookie('jwt',token,cookieSettings);

  console.log(res.cookie);

  res.status(statusCode).json({
    message:'Successfully logged in',
    token,
    data:{user},
    status:'success'
  });

};

const signUpUser=fn(async(req,res,next)=>{
  console.log(req.body);

  const newUser=await  User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
    passwordChangedAt:req.body.passwordChangedAt ||null,
    role:req.body.role
  });

  const url=`${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser,url).sendWelcome();

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
  console.log(user+'user');
  console.log(password);

  if(!user ||! await user.isPasswordCorrect(password,user.password)){
    return next(new AppError('Invalid email or password',401));
  }

  createSendToken(user,200,res);
});

const loggedIn=(async (req,res,next)=>{

  try{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt){
      token=req.cookies.jwt;
    }
    if(!token) next(new AppError('You are not logged in. Login to get access.',401));


    const data=await promisify(jwt.verify)(token,process.env.JWT_SECRET);


    const loggedInUser= await User.findById(data.id).select('+passwordChangedAt');


    if(!loggedInUser) next(new AppError('The user was deleted'),401);


    if(loggedInUser.isPasswordChanged(data.exp)) next(new AppError('The password was changed in the meantime',401));

    req.user=loggedInUser;
    res.locals.user=loggedInUser;
    next();
  }catch (err){
    return next();
  }
});

const logout = fn(async (req,res,next)=>{
  res.cookie('jwt','loggedout',{
    expires:new Date  (Date.now()+10*1000),
    httpOnly:true
  });
  res.status(200).json({
    status:'success'
  });
})
//verify if the user was deleted or the jwt is malformed
const userHasToken=fn(async (req,res,next)=>{
  //verify token
  if(req.cookies.jwt){
    try{
      const decoded= await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET);

      const loggedInUser= await User.findById(decoded.id).select('+passwordChangedAt');
      if(!loggedInUser) next(new AppError('The user was deleted'),401);

      if(loggedInUser.isPasswordChanged(decoded.exp)) next(new AppError('The password was changed in the meantime',401));

      res.locals.user=loggedInUser;
      return next();

    }catch(err){
      return next();
    };

    }
  next();
});

const authz=(...roles)=>{

  return (req,res,next)=>{
    if(!roles.includes(req.user.role)) throw new AppError('Unauthorized attempt!',401);
    next();
  }
};

const generateResetToken=fn(async (req,res,next)=>{

  //Get user based on their email address
  const user=await User.findOne({email:req.body.email});

  if(!user) next(new AppError('User not found',404));

  //generate token
  const token=user.forgotPassword();
  await user.save({validateBeforeSave:false});


  //sending reset token to email
  const resetURL= `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;
  console.log(resetURL);
  try{
    await new Email(user,resetURL).sendPasswordReset();

    res.status(200).json({
      status:'success',
      message:'Token sent to email!'
    });
  }catch (err){
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save({validateBeforeSave:false});

    console.log(err);
    return next(new AppError('Try again later!',500));;
  }
});

const resetPassword=fn(async (req, res, next) => {
  //get user from the token
  console.log(req);
  const user=await  User.findById(req.user.id).select('+password');
  //user and token not expired
  console.log(user);
  if(!user){
    return next(new AppError('Token is invalid or is expired!',400));
  }
  //if the token didn't expire send password reset
  //update the passwordResetAt
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  user.passwordResetToken=undefined;
  user.passwordResetTokenExpires=undefined;
  await user.save();

  //Log the user in and send JWT
  createSendToken(user,201,res);

});

const updatePassword=fn(async (req,res,next)=>{
  //get user

  //user and token not expired

  const user = await User.findById(req.user._id).select('+password');
  if(!user){
    return next(new AppError('Token is invalid or is expired!',400));
  }
  //check if pwd is correct
  const requestEncrypt=await user.isPasswordCorrect(req.body.password,user.password);

  //update
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  user.passwordChangedAt=Date.now();
  user.save();

  //update jwt

  createSendToken(user,201,res);

});

module.exports={signUpUser,loginUser,loggedIn,authz,generateResetToken,resetPassword,updatePassword,userHasToken,logout};