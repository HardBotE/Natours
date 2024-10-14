 const getAllUsers=(req,res)=>{
  res.status(500).json({
    status:'error',
    message:'We don`t currently have any users.'
  })
};

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