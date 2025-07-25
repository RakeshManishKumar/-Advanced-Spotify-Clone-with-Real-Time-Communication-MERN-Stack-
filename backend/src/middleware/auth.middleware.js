import { clerkClient } from "@clerk/express";

export const portectRoute = async(req,res,next)=>
{
  try {
    const auth = await req.auth();
    if(!auth || !auth.userId)
    {
      res.status(401).json({message:"Unauthorized - you must be logged in"});
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({message:"Unauthorized - you must be logged in"});
    return;
  }
}
 
export const requireAdmin = async(req,res,next)=>
{
  try {
    const auth = await req.auth();
    if(!auth || !auth.userId) {
      res.status(401).json({message: "Unauthorized - user not authenticated"});
      return;
    }
    
    const currentUser  = await clerkClient.users.getUser(auth.userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress.emailAddress;
    if(!isAdmin)
    {
      res.status(403).json({message: "Unauthorized - you must be a admin"});
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}
