import express from "express";
import multer from "multer";
import { geminiByLangchain } from "../controller/geminiByLangchain.js";

const geminiLangchainRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
geminiLangchainRouter.post(
  "/geminilangchain",
  upload.single("file"),
  geminiByLangchain
);

export default geminiLangchainRouter;
