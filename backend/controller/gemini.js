import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

dotenv.config();

const bufferStream = (buffer) => {
  try {
    let stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  } catch (e) {
    return e;
  }
};

export const geminibot = async (req, res) => {
  try {
    console.log("bot called");
    // console.log("file:-",req.file.buffer);

    // let pdfStream = bufferStream(req.file.buffer);
    // const stream = new Readable();
    // stream.push(req.file.buffer);
    // stream.push(null);

    // const loader = new PDFLoader(pdfStream);
    // const doc = await loader.load();
    // console.log("CV:-", doc);

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });  //Install PDF-parse, langchain@latest, use PDFLoader from langchain

    // Load PDF using Blob
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    // console.log(docs);

    let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "Tell me anything?";

    let response = await model.generateContent(prompt);
    let result = await response.response;

    res.status(200).json({ reply: result.text() });
  } catch (e) {
    res.status(500).json({ msg: e });
  }
};
