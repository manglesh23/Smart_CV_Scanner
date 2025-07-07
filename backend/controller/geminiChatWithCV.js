import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

dotenv.config();

export const geminiChatWithCV = async (req, res) => {
  try {
    // console.log(1);

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    // console.log(blob);
    let loader = new PDFLoader(blob);
    let getFile = await loader.load();
    let cvData = getFile.map((doc) => doc.pageContent).join("\n");
    // console.log(cvData.length)
    // console.log(cvData);
    let memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "messages",
    });
    // console.log(2);
    let model = new ChatGoogleGenerativeAI({
      model: "models/gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3,
    });

    let systemPrompt = `
You are SmartHireBot. You answer HR-related questions based on resume data.
Resume:
{cvData}
Answer as accurately as possible and rate the match out of 100. If data is missing, say "Not available".

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
`;

    //ChatPromptTemplate got fromMessages
    //PromTemplat got fromTemplate

    let prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
      ["human", "{input}"],
    ]);

    // console.log(3.1);
    let chain = RunnableSequence.from([
      async (input) => {
        const pastMessages = await memory.loadMemoryVariables({});
        return {
          input: input.input,
          cvData,
          messages: pastMessages.messages || [],
        };
      },
      prompt,
      model,
    ]);

    // console.log(4);
    try {
      let result = await chain.invoke({
        input: "What's Candidate Experience with Ruby on Rails",
        //   message: [
        //     { role: "human", content: "Give me a brief summary" },
        //     {
        //       role: "ai",
        //       content: "The candidate has 5 years of Node.js experience.",
        //     },
        //   ],
      });

      let analysis = result.content;
      const jsonOnly = analysis.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(jsonOnly);

      res.status(200).json({ Result: analysis });

      await memory.saveContext(
        { input: "What's candidate experience with Node.js" },
        { output: result }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e, Analysis: "Invoke chain" });
    }
    // console.log(5);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
};
