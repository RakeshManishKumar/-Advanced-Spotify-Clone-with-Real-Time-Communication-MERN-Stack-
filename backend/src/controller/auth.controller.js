import { User } from "../models/user.model.js";

export const checkAuth = async (req, res, next) => {
  try {
    console.log('Auth callback received:', req.body);
    
    const { id, firstName, lastName, imageUrl } = req.body;

    // Validate required fields
    if (!id) {
      console.error('Missing required field: id');
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    if (!firstName || !lastName) {
      console.error('Missing required fields: firstName or lastName');
      return res.status(400).json({ error: 'Missing required fields: firstName or lastName' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });
    
    if (!existingUser) {
      console.log('Creating new user with clerkId:', id);
      
      // Create new user
      const newUser = await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl: imageUrl || ''
      });
      
      console.log('User created successfully:', newUser);
      res.status(200).json({ success: true, message: 'User created', user: newUser });
    } else {
      console.log('User already exists:', existingUser);
      res.status(200).json({ success: true, message: 'User already exists', user: existingUser });
    }
  } catch (error) {
    console.error('Error in auth callback:', error);
    res.status(500).json({ error: error.message });
  }
};