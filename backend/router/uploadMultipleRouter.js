import express from 'express';
import multer from 'multer';
import { uploadMultpleFile } from '../controller/uploadMultipleFiles.js';

const storage= multer.memoryStorage()
const upload= multer({storage});

const uploadMultipleRouter= express.Router();

uploadMultipleRouter.post("/uploadfiles",upload.array('files',10),uploadMultpleFile);

export default uploadMultipleRouter;