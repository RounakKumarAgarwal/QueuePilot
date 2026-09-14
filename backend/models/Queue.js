const mongoose = require('mongoose');
const queueSchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  isActive:{type:Boolean,default:true},  
  lastTokenNumber:{type:Number, default:0},
},{timestamps:true});

module.exports=mongoose.model('Queue',queueSchema);
