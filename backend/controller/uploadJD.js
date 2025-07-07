// import e from "express";
import job_discription from "../job_Discription/jobdiscription.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const uploadJD = async (req, res) => {
  try {
    let get_Job_DesCription = req.body.job_description;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const JD_FilePath = path.join(
      __dirname,
      "../job_Discription/jobDescription.txt"
    );
    fs.writeFile(JD_FilePath, get_Job_DesCription, "utf-8", (err, data) => {
      if (err) {
         res.status(404).json({ msg: "Encounter Error" });
      }
      res.status(200).json({ message: "JD updated successfully" });
    });

    // res.status(200).json({ job_discription: job_discription });
  } catch (e) {
    res.status(500).json({ msg: "Error", Error: e });
  }
};
