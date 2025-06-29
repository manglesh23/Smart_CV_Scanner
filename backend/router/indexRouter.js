import express from 'express';
import geminiRouter from './geminiRouter.js';
import geminiLangchainRouter from './geminiLangchainRouter.js';

const router= express.Router();

router.use('/rag',geminiRouter);
router.use('/rag',geminiLangchainRouter);

export default router;