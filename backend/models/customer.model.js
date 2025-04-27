const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    avatar:{
      type:String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    address:[{
      type:String,

    }],
    orders:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Order"
    }],
    gender:{
      type:String,
      enum:["Male","Female","Other"]
    },
    expiresAt: {
      type: Date,
      default:new Date( Date.now()),
      expires:10*24*60*60,
    },
  },
  {timestamps: {
    currentTime: () => new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    })}}
);



customerSchema.statics.updateVerify = async function (customerId) {
  const user = await this.findOne({_id:customerId });
  if (!user) return false;

  await this.findByIdAndUpdate(
    { _id:customerId },
    {
      isVerified: true,
      '$unset':{expiresAt:""}
    }
  );

  return true;
};

module.exports=mongoose.model("Customer",customerSchema);


