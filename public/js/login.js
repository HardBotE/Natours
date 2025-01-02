import axios from 'axios';
export const login=async (email,password)=>{

  try{
    const res =await axios({
      method: 'post',
      url:`http://localhost:3000/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });
    console.log(res.data);

    if(res.data.status==='success')
    {
      window.setTimeout(()=>{
        location.assign('/');
      },1500)
    }

  }catch(err){
    console.log(err.response.data);
  }
};
