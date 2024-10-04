
import { Request, Response } from 'express';
import User,{IUser} from '../../models/User';
import { cloudinary } from '../../config/fileUploads';
import fs from 'fs';

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
      profilePicture: user.profilePicture,
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
      const { userId } = req.params;
      const { name } = req.body;
  
      let profilePictureUrl;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'userProfilePictures', 
          public_id: `${userId}_profilePicture`,
          overwrite: true,
        });
  
        profilePictureUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  console.log("Updated user profile",updatedUser)
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  };