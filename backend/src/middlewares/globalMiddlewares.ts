// src/middleware/globalMiddleware.ts
import express from 'express';
import cors from 'cors';

const applyGlobalMiddleware = (app: express.Application) => {
  app.use(cors());
  app.use(express.json());
};

export default applyGlobalMiddleware;