import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import job_discription from "../job_Discription/jobdiscription.js";
// import fs from 'fs'
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

/*-----------------This API Compare CV with Jobdescription Uploaded By Recruiter------------------*/
/*                Fetch Candidate Details, Match Score, Matching Skills and Unmatched Skills      */
/*------------------------------------------------------------------------------------------------*/

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

    let __fileName = fileURLToPath(import.meta.url);
    let __dirname = path.dirname(__fileName);

    let jdFilePath = path.join(
      __dirname,
      "../job_Discription/jobDescription.txt"
    );
    let get_Job_DesCription = await readFile(jdFilePath, "utf-8"); //Fetching JobDescription From .txt file, uploaded by User through uploadJD API
    // console.log("Job Description:-",get_Job_DesCription)

    //PromTemplat got fromTemplate

    const prompt =
      PromptTemplate.fromTemplate(`Compare this Job Description and Resume. 
        Job Description: {job}
        Resume:
        {summary}
        Rate the match out of 100.
        Instruction:
        Extract the following fields from the resume and return only valid JSON:

- name
- current company (array if more than one)
- position
- education
- matched_skills
- missing_skills
- score (out of 100)
- summary (2-3 lines)

Format:
{{
  "candidate_information": {{
    "name": "",
    "current_company": [],
    "position": "",
    "education": "",
    "Skills":""
  }},
  "analysis": {{
    "matched_skills": [],
    "missing_skills": [],
    "score": 0
  }},
  "summary": ""
}}
`);
    // console.log(input)
    let matchChain = RunnableSequence.from([
      (input) => ({ job: input.job, summary: input.summary }), //Arrow Function, input is the object form invoke
      prompt,
      model,
    ]);
    // console.log(3);
    let result = await matchChain.invoke({
      job: get_Job_DesCription,
      summary: candidateCV,
    }); //Object passed in invoke is input in the arrow function in matchChain

    let analysis = result.content;
    let jsonData = analysis.replace(/```json|```/g, "").trim();
    analysis = JSON.parse(jsonData);
    res.status(200).json({ result: analysis });
  } catch (e) {
    res.status(500).json({ msg: e });
  }
};
