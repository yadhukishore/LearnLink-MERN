import { Request, Response } from 'express';
import Event, { IEvent } from '../../models/Event';
import { cloudinary } from '../../config/fileUploads';

export const addEvent = async (req: Request, res: Response) => {
    try {
      console.log('Received event data:', req.body);
      console.log('Received file:', req.file);
  
      const { title, description, type } = req.body;
      let imageUrl = '';
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        console.log('Cloudinary upload result:', result);
      }
  
      console.log('Final event data to be saved:', {
        title,
        description,
        imageUrl,
        type
      });
  
      const newEvent = new Event({ title, description, imageUrl, type });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ message: 'Error adding event', error });
    }
  };
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    let updateData: Partial<IEvent> = { title, description, type };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = result.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};