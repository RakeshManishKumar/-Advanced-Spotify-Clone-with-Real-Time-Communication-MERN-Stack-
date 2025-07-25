import {User} from "../models/user.model.js";
import {Message} from "../models/message.model.js";
export const getAllUsers =async (req,res,next)=>
{
  try {
    const auth = await req.auth();
    const currUserId = auth.userId;
    const users = await User.find({clerkId : {$ne : currUserId}});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export const getMessages =   async(req,res,next) =>
{
  try {
    const auth = await req.auth();
    const myId = auth.userId;
    const {userId} = req.params;    

    const message = await Message.find({
      $or : [
        {senderid : myId, receiverId : userId},
        {senderid : userId, receiverId : myId}
      ]
    }).sort({createdAt : -1});
    res.status(200).json(message);      
  } catch (error) {
    next(error);
  }
}