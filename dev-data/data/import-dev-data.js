
const fs=require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tours=require('../../Models/tourModel');
const Users = require('../../Models/userModel');
const Review = require('../../Models/reviewModel');


//READ FILES
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));


//CONNECT TO DB
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


//Importing data
const importData=async ()=>{
    try{
      await Tours.create(tours);
      await Users.create(users,{validateBeforeSave:false});
      await Review.create(reviews);
      console.log('Successfully loaded all files');
    }catch (err){
      console.log(err);
    }
}

const deleteData=async ()=>{
  try{
    await Tours.deleteMany();
    await Users.deleteMany();
    await Review.deleteMany();
    console.log('Successfully deleted all files');
  }catch (err){
    console.log(err);
  }
}

console.log(process.argv[2]);
if (process.argv[2] === '--import') {
  importData().then(() => process.exit());
} else if (process.argv[2] === '--delete') {
  deleteData().then(() => process.exit());
}




console.log(process.argv);