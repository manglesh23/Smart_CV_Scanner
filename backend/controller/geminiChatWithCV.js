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
    console.log(1);

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
    console.log(2);
    let model = new ChatGoogleGenerativeAI({
      model: "models/gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3,
    });

    let systemPrompt = `You are SmartHireBot. You answer HR-related questions based on resume data.
  Resume:
  {cvData}
  Answer as accurately as possible. If data is missing, say "Not available".`;
    console.log(3);

    //ChatPromptTemplate got fromMessages
    //PromTemplat got fromTemplate

    let prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
      ["human", "{input}"],
    ]);

    console.log(3.1);
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

    console.log(4);
    try {
      let result = await chain.invoke({
        input: "What's candidate experience with node.js",
        //   message: [
        //     { role: "human", content: "Give me a brief summary" },
        //     {
        //       role: "ai",
        //       content: "The candidate has 5 years of Node.js experience.",
        //     },
        //   ],
      });
      res.status(200).json({ msg: result.content });

      await memory.saveContext(
        { input: "What's candidate experience with Node.js" },
        { output: result }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e, msg: "Invoke chain" });
    }
    console.log(5);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
};
