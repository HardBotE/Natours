const AppError = require('../Utils/appError');

function checkEnvVariable() {
  const envValue = process.env.NODE_ENV || ''; // Biztonságos kezelés, ha nincs beállítva.
  if (envValue.endsWith(' ')) { // Ellenőrzi, hogy szóközzel végződik-e.
    console.error('Hiba: A NODE_ENV változó értékének végén szóköz található!');
  } else {
    console.log('NODE_ENV értéke rendben van:', envValue);
  }
}
checkEnvVariable();
function handleCastError(error) {

  let message=`Invalid  ${error.path} value: ${error.value}`;
  return new AppError(message,400);

};

function handleDuplicateKey(error) {

  let msg=`Duplicate field:${error.keyValue.name}. Enter another value.`;
  return new AppError(msg,400);
}
function handleTypeError(error) {
  return new AppError("The difficulty can only be:easy,medium,difficult, the ratings average is between 1 and 5",400);
}

const errorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    errors:err.errors,
    name:err.name

  });
}


const errorProd=(err,res)=>{
  if(err.isOperational){
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });}
  else {
    res.status(500).json({
      status:'error',
      message:'Something went wrong....',
    });
  }
};




module.exports=(err, req, res, next)=>{

  err.statusCode=err.statusCode || 500;
  err.status=err.status ||"error";

  if(process.env.NODE_ENV === "development"){
    errorDev(err,res);
  }else if(process.env.NODE_ENV === "production") {
    let error = {...err};

    if(err.name==='CastError') error=handleCastError(error);
    if(err.code===11000) error=handleDuplicateKey(error);
    if(err.name==='TypeError') error=handleTypeError(error);

    errorProd(error,res);
  }
};