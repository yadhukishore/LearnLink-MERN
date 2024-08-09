import { Request, Response } from 'express';
import Feed,{IFeed} from '../../models/Feeds';
import User from '../../models/User';

export const createFeed = async (req: Request, res: Response) => {
  try {
    const { content, image,userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
    const newFeed: IFeed = new Feed({
      user: userId,
      content,
      image,
    });

    await newFeed.save();

    res.status(201).json({ message: 'Feed created successfully', feed: newFeed });
  } catch (error) {
    res.status(500).json({ message: 'Error creating feed', error});
  }
};

export const getFeeds = async (req: Request, res: Response) => {
  try {
    const feeds = await Feed.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.status(200).json(feeds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feeds', error});
  }
};