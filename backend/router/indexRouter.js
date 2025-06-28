import express from 'express';
import geminiRouter from './geminiRouter.js';

const router= express.Router();

router.use('/rag',geminiRouter);

export default router;