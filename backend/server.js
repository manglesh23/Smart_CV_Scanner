import express, { Router } from "express";
import dotenv from "dotenv";
import router from "./router/indexRouter.js";
import morgan from "morgan";

dotenv.config();
const app = express();



app.use(express.json());

app.use(morgan("dev"));

app.use("/", router);

app.use((err, req, res, next) => {
    console.log("Req url:-",req.originalUrl)
  if (err) {
    res.status(404).json({ error: "Something broke" });
  }
  next(err)
});
// console.log(__dirname)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
