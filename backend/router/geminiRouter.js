import express from 'express';
import { geminibot } from '../controller/gemini.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload= multer({storage});

const geminiRouter= express.Router();

geminiRouter.post('/gemini',upload.single('file'),geminibot); //Multer to upload CV

export default geminiRouter;