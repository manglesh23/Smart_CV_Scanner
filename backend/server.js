import express, { Router } from 'express';
import dotenv from 'dotenv';
import router from './router/indexRouter.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/',router)

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`)
})

