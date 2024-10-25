const fn = require('../Utils/catchAsync');
const User = require('../Models/userModel');


const getAllUsers=fn(async (req,res,next)=>{
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    items: users.length,
    data: {
      users
    }
  });
});

 const getUser=(req,res)=>{
  res.status(500).json({
    status:'error',
    message:'Invalid user'
  })
};

 const updateUser=(req,res)=>{
  res.send('User added.');
};

 const modifyUser=(req,res)=>{
  res.send('User modified');
}

 const deleteUser=(req,res)=>{
  res.send('User deleted');
};

 module.exports={getAllUsers,
   getUser,
   updateUser,
   modifyUser,
   deleteUser
 };