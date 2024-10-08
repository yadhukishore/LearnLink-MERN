import { Request, Response } from 'express';
import Feed, { IFeed } from '../../models/Feeds';
import { cloudinary } from '../../config/fileUploads'; 

export const createFeed = async (req: Request, res: Response) => {
  console.log("User Trying to Create a Feed");
  try {
    const { content, userId } = req.body;
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'feeds',
        resource_type: 'auto'
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const fileData = uploadResults.map(result => ({
      url: result.secure_url,
      fileType: result.resource_type === 'image' ? 'image' : 'file'
    }));

    const newFeed: IFeed = new Feed({
      user: userId,
      content,
      files: fileData,
    });

    await newFeed.save();

    res.status(201).json({ message: 'Feed created successfully', feed: newFeed });
  } catch (error) {
    console.error('Error creating feed:', error);
    res.status(500).json({ message: 'Error creating feed', error });
  }
};

export const getFeeds = async (req: Request, res: Response) => {
  try {
    console.log("Feed pagee")
    const feeds = await Feed.find({ isDeleted: false }).sort({ createdAt: -1 }).populate('user', 'name profilePicture');
    res.json(feeds);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).json({ message: 'Error fetching feeds' });
  }
};


export const reportFeed = async (req: Request, res: Response) => {
  try {
    const { feedId } = req.params;
    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }
    console.log(`${feed} is Reported.`)

    feed.isReported = true;
    await feed.save();

    res.json({ message: 'Feed reported successfully' });
  } catch (error) {
    console.error('Error reporting feed:', error);
    res.status(500).json({ message: 'Error reporting feed' });
  }
};

export const DeleteFeed = async (req: Request, res: Response) => {
  try {
    const { feedId } = req.params;
    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    feed.isDeleted = true;
    await feed.save();

    res.json({ message: 'Feed Deleted successfully' });
  } catch (error) {
    console.error('Error deleting feed:', error);
    res.status(500).json({ message: 'Error deleting feed' });
  }
};