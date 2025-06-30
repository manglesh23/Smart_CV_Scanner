import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import job_discription from "../job_Discription/jobdiscription.js";
import dotenv from "dotenv";

dotenv.config();
export const geminiByLangchain = async (req, res) => {
  try {
    // console.log(req.file);
    let model = new ChatGoogleGenerativeAI({
      //Model Initiated
      model: "models/gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3,
    });

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype }); //Blob to extract data from PDF file
    // console.log(1);
    let loader = new PDFLoader(blob); //Pass the file
    let document = await loader.load(); // Return an Array of pageContent

    let candidateCV = document.map((doc) => doc.pageContent).join("\n");

    // console.log(2);
    const prompt =
      PromptTemplate.fromTemplate(`Compare this Job Description and Resume.
        Job Description: {job}
        Resume:
        {summary}
        Rate the match out of 100. Then explain Positive and negative in separate paragraph.`);
    // console.log(input)
    let matchChain = RunnableSequence.from([
      (input) => ({ job: input.job, summary: input.summary }), //Arrow Function, input is the object form invoke
      prompt,
      model,
    ]);
    // console.log(3);
    let result = await matchChain.invoke({
      job: job_discription,
      summary: candidateCV,
    }); //Object passed in invoke is input in the arrow function in matchChain

    res.status(200).json({ msg: result.content });
  } catch (e) {
    res.status(500).json({ msg: e });
  }
};
