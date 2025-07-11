import express from "express";
import geminiRouter from "./geminiRouter.js";
import geminiLangchainRouter from "./geminiLangchainRouter.js";
import geminiChatRouter from "./geminiChatwithCV.js";
import uploadJDRouter from "./uploadJDRouter.js";
import uploadMultipleRouter from "./uploadMultipleRouter.js";

const router = express.Router();

router.use("/rag", geminiRouter);
router.use("/rag", geminiLangchainRouter);
router.use("/rag", geminiChatRouter);
router.use("/upload",uploadJDRouter);
router.use("/upload",uploadMultipleRouter)

export default router;
