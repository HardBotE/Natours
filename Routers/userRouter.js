const express = require('express');
const {getAllUsers,updateUser,getUser,modifyUser,deleteUser, modifyUserData, deleteMe, getMe, uploadUserPhoto,
  resizeUserPhoto
}=require('../Controllers/userController');
const { signUpUser, loginUser, generateResetToken, resetPassword, updatePassword, loggedIn, authz,logout } = require('../Controllers/authController');
const multer=require('multer');

const upload=multer({dest:'public/img/users'});

const userRouter=express.Router();


userRouter.route('/signup').post(signUpUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').get(logout);
userRouter.route('/forgotPassword').post(generateResetToken);
userRouter.route('/resetPassword/:token').patch(resetPassword);

userRouter.use(loggedIn);

userRouter.route('/me').get(getMe,getUser);
userRouter.route('/updatePassword').patch(updatePassword);
userRouter.route('/modifyUserData').patch(uploadUserPhoto,resizeUserPhoto,modifyUserData);
userRouter.route('/deleteMe').patch(deleteMe);

userRouter.use(authz('admin'));

userRouter.route('/userInfo').get(getUser);
userRouter.route('/').get(getAllUsers).post(modifyUser);



module.exports=userRouter;
