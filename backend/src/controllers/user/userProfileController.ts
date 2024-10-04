
import { Request, Response } from 'express';
import User,{IUser} from '../../models/User';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
 console.log("User Profile tharatta")
 const userId = req.params.userId;

    if (!userId) {
        console.log("User id illatta")
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
        console.log("Database ill polum illa")
      return res.status(404).json({ message: 'User not found' });
    }
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    //   wishlist: user.wishlist,
    };

    res.json({ user: userProfile });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { name } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
  
      res.json({ user: userProfile });
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };