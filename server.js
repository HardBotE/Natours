const {app}=require('./app');

const dotenv=require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException',err=>{
  console.log("UNGAUGHT EXCEPTION! Stutting down....");
  server.close(()=>{
    process.exit(1);
  })
});
dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);


mongoose.connect(DB,{

  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology: true

})
  .then(con=>{

    console.log('DB connection established');

  });

const port=process.env.PORT||3000;

const server=app.listen(port,()=>{
  console.log((`Welcome from the ${port} port`));
});

process.on('unhandledRejection',(err)=>{
  console.log(err);
  server.close(()=>{
    console.log("UNHANDLED REJECTION! Shutting down the server....");
    process.exit(1);
  })
});




