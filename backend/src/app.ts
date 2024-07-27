import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongoConnect';
import applyGlobalMiddleware from './middlewares/globalMiddlewares';
import routes from './routes/index';

dotenv.config();

const app = express();

// Apply global middleware
applyGlobalMiddleware(app);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', routes);


export default app;