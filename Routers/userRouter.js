const express = require('express');
const {getAllUsers,updateUser,getUser,modifyUser,deleteUser}=require('../Controllers/userController');
const userRouter=express.Router();




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
