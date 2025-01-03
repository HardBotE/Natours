import axios from 'axios';

//vagy 'password' type lesz vagy 'data'
export const updateSettings=async (data,type)=>{
  console.log(data,type);
  try{
    const url= type ==='password'?`http://localhost:3000/api/v1/users/updatePassword`:`http://localhost:3000/api/v1/users/modifyUserData`;
    const res= await axios({
      method: 'PATCH',
      url,
      data
    });
    console.log(res.data.status);
    if(res.data.status==='success'){
      //showalert popup +ba
      location.reload();
    }

  }catch(err){
    console.log(err);
  }

}