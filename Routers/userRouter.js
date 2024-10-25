const express = require('express');
const {getAllUsers,updateUser,getUser,modifyUser,deleteUser}=require('../Controllers/userController');
const { signUpUser, loginUser, loggedIn } = require('../Controllers/authController');
const userRouter=express.Router();



userRouter
  .route('/signup')
  .post(signUpUser);

userRouter
  .route('/login')
  .post(loginUser);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(updateUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(modifyUser)
  .delete(deleteUser);

module.exports=userRouter;
