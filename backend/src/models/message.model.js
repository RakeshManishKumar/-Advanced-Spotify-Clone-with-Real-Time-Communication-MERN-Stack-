import mongoose from 'mongoose'
const messageSchema  = new mongoose.Schema(
{
  senderid  : {type:String , required : true},
  receiverId : {type: String ,required:  true},
  content : {type: String ,required:  true},
},
  {timestamps : true}
);

export const Message = mongoose.model('Message' , messageSchema);