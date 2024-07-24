require('dotenv').config();

import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

//body-parser
app.use(express.json({limit:"50mb"}));

//cookie parser
app.use(cookieParser());

app.use(cors({
    origin: process.env.ORIGIN
}));
//connect to mongo
mongoose.connect(process.env.MONGO_URI as string,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error: ", err));

//testing api
app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
 res.status(200).json({
    success:true,
    message:"API is Working",
 })
});
// unknown api
app.all("*",(req: Request,res:Response,next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not Found Bruh!`) as any;
    err.statusCode = 404;
    next(err);
})