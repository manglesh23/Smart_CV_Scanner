import express from "express";
import multer from "multer";
import { geminiChatWithCV } from "../controller/geminiChatWithCV.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const geminiChatRouter = express.Router();

geminiChatRouter.post("/geminiChat", upload.single("file"), geminiChatWithCV);

export default geminiChatRouter;
