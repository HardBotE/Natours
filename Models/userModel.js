const bcrypt=require('bcrypt');
const mongoose=require( 'mongoose');
const validator=require('validator');
const crypto=require('crypto');

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
      type:String
    },
    role:{
      type:String,
      enum:['user','tour-guide','tour-guide-lead','admin'],
      default:'user'
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
    },
    passwordResetToken:{
      type:String
    },
    passwordResetTokenExpires:{
      type:Date
    },

    isActive:{
      type:Boolean,
      default:true,
      select:false
    }
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }
);

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  this.password=await bcrypt.hash(this.password,12);

  this.passwordConfirm=undefined;
});

userSchema.pre('save',function(next){
  if(!this.isModified('password') || this.isNew ) return next();

  this.isPasswordChangedAt=Date.now()-1000;
  next();
})

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

userSchema.methods.forgotPassword=function()  {

  const resetToken = crypto.randomBytes(36).toString('hex');
  this.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({resetToken},this.passwordResetToken);

  this.passwordResetTokenExpires=Date.now()+ 60*10*1000;

  return resetToken;
}

const Users=mongoose.model('User',userSchema);

module.exports=Users;