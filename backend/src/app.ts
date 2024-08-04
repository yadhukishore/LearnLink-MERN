import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongoConnect';
import applyGlobalMiddleware from './middlewares/globalMiddlewares';
import routes from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';


dotenv.config();

const app = express();
// Increase the limit. Adjust the value as needed.
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Apply global middleware
applyGlobalMiddleware(app);

// Connect to MongoDB
connectDB();
app.use(cors());
// Routes
app.use('/api', routes);



export default app;