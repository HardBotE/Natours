const {app}=require('./app');

const dotenv=require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);


mongoose.connect(DB,{

  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false

})
  .then(con=>{

    console.log(con.connections);

    console.log('DB connection established');

  });

const port=process.env.PORT||3000;

app.listen(port,()=>{
  console.log((`Welcome from the ${port} port`));
});
