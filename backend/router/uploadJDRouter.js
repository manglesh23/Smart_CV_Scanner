import express from 'express';
import { uploadJD } from '../controller/uploadJD.js';

const uploadJDRouter= express.Router();

uploadJDRouter.post("/uploadjd",uploadJD);

export default uploadJDRouter;