const mongoose=require('mongoose');

const counterSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    queueId:{type:mongoose.Schema.Types.ObjectId,ref:'Queue',required:true},
    status:{type:String,enum:['active','offline'],default:'active'},
    currentToken:{type:mongoose.Schema.Types.ObjectId,ref:'Token',default:null},
    avgServiceTimeSeconds:{type:Number,default:300},
    staffId:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
},{timestamps:true});

module.exports=mongoose.model('Counter',counterSchema)