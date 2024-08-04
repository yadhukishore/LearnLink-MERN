// src/middleware/globalMiddleware.ts
import express from 'express';
import cors from 'cors';

const applyGlobalMiddleware = (app: express.Application) => {
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());
  app.use(express.json());
};

export default applyGlobalMiddleware;