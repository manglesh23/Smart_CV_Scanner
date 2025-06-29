import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import job_discription from "../job_Discription/jobdiscription.js";

dotenv.config();

export const geminibot = async (req, res) => {
  try {
    console.log("bot called");

    //Blob is Supported by langchain@latest
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype }); //Install PDF-parse, langchain@latest, use PDFLoader from langchain

    // Load PDF using Blob
    const cvloader = new PDFLoader(blob); //PDFLoaded From Langchain
    const docs = await cvloader.load();
    // console.log("docs:-",docs[0].pageContent);

    let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `Compare this Job Description and Resume. Job Description: ${job_discription} Resume: ${docs[0].pageContent} Rate the match out of 100. Then explain why. `;

    let response = await model.generateContent(prompt);
    let result = await response.response;

    res.status(200).json({ reply: result.text() });
  } catch (e) {
    res.status(500).json({ msg: e });
  }
};
