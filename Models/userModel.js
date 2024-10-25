const bcrypt=require('bcrypt');
const mongoose=require( 'mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:[true,"A user must have a name"]
    },
    email:{
      type:String,
      required:[true,"A user must have an email address"],
      unique:[true,"No duplicated email allowed"],
      lowercase:true,
      validate:[validator.isEmail,'Provide a valid email']
    },
    image:{
      data:Buffer,
      type:String
    },
    password:{
      type:String,
      required:[true,'All users must have a password!'],
      minlength:8,
      select:false
    },
    passwordConfirm:{
      type:String,
      required:[true,'All users must have a password!'],
      validate:{
        validator:function(el){
          return el===this.password;
        },
        message:'Passwords are not the same'
      }
    },
    passwordChangedAt:{
      type:Date,
      select:true
    }

  }
)

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  this.password=await bcrypt.hash(this.password,12);

  this.passwordConfirm=undefined;
});

userSchema.methods.isPasswordCorrect=function(candidatePassword,hashedPassword){
  return bcrypt.compare(candidatePassword,hashedPassword);
};

userSchema.methods.isPasswordChanged=function(JWTTimestamp){
    if(this.passwordChangedAt){
      const changedTime=parseInt(this.passwordChangedAt.getTime()/1000,10);

      return JWTTimestamp<changedTime;
    }

return false;
};

const Users=mongoose.model('User',userSchema);
module.exports=Users;