import { Request, Response } from 'express';
import User from '../../models/User';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password'); 
    console.log(users);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};