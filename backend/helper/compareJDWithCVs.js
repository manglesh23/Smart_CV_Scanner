import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
// import job_discription from "../job_Discription/jobdiscription";

dotenv.config();

export const compareJDwithCVs = async (files) => {
  try {
    // console.log("Files:-",files)
    let chatModel = new ChatGoogleGenerativeAI({
      model: "models/gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3,
    });

    let blob = new Blob([files.buffer], { type: files.mimetype });
    let loader = new PDFLoader(blob);
    let cvData = await loader.load();

    let candidateCV = cvData.map((data) => data.pageContent).join("\n");
    let __fileName = fileURLToPath(import.meta.url);
    let __dirname = path.dirname(__fileName);

    let jdPath = path.join(__dirname, "../job_Discription/jobDescription.txt");
    let job_Discription = await readFile(jdPath, "utf-8");
    console.log(job_Discription)

    let prompt =
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
    }}`);
    
    // console.log("3")
    let chain = RunnableSequence.from([
      (input) => ({ job: input.jobDescription, summary: input.candidateCV }),
      prompt,
      chatModel,
    ]);
    
    // console.log("5")
    let result = await chain.invoke({
      jobDescription: job_Discription,
      candidateCV: candidateCV,
    });
    let analysis = result.content;
    // console.log("6")
    // console.log(analysis)
    let jsonFormat = analysis.replace(/```json|```/g, "").trim();
    analysis = JSON.parse(jsonFormat);
    // console.log("ANAlysis:-",analysis)
    return analysis;
  } catch (e) {
    return e;
  }
};
