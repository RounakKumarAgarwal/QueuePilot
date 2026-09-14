const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenNumber: { type: Number, required: true },
    queueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['waiting', 'assigned', 'in-service', 'served', 'no-show', 'cancelled'], default: 'waiting' },
    priorityClass:{type:String,enum:['normal','priority'],default:'normal'},
    effectivePriority:{type:Number,default:0},
    assignedCounterId:{type:mongoose.Schema.Types.ObjectId,ref:'Counter',default:null},
    joinedAt:{type:Date,default:Date.now},
    serviceStartedAt:{type:Date,default:null},
    servedAt:{type:Date,default:null},
}, { timestamps: true });

module.exports=mongoose.model('Token',tokenSchema);