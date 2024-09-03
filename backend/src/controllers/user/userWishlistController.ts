import { Request, Response } from 'express';
import User from '../../models/User';
import Course from '../../models/Course';

export const addToWishlist = async (req: Request, res: Response) => {
    try {
      const { userId, courseId } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (user.wishlist.includes(courseId)) {
        return res.status(400).json({ message: 'Course is already in wishlist' });
      }
  
      user.wishlist.push(courseId);
      await user.save();
      res.status(200).json({ message: 'Course added to wishlist' });
    } catch (error) {
      console.error('Error adding to wishlist:', error);  // Logging for debugging
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body; 
    console.log("Removedfrom Wishlist",req.body)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== courseId);
    await user.save();

    res.status(200).json({ message: 'Course removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; 

    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
