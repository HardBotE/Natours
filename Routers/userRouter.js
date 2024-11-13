const express = require('express');
const {getAllUsers,updateUser,getUser,modifyUser,deleteUser, modifyUserData, deleteMe, getMe }=require('../Controllers/userController');
const { signUpUser, loginUser, generateResetToken, resetPassword, updatePassword, loggedIn, authz } = require('../Controllers/authController');
const userRouter=express.Router();


userRouter.route('/signup').post(signUpUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/forgotPassword').post(generateResetToken);
userRouter.route('/resetPassword/:token').patch(resetPassword);

userRouter.use(loggedIn);

userRouter.route('/me').get(getMe,getUser);
userRouter.route('/updatePassword').patch(updatePassword);
userRouter.route('/modifyUserData').patch(modifyUserData);
userRouter.route('/deleteMe').patch(deleteMe);

userRouter.use(authz('admin'));

userRouter.route('/userInfo').get(getUser);
userRouter.route('/').get(getAllUsers).post(modifyUser);



module.exports=userRouter;
