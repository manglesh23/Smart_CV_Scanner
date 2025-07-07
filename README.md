Smart CV Scanner – Built a backend system that parses and analyzes CVs using NLP and AI. Features include secure file upload (PDF/DOCX), named entity recognition (NER), job-CV matching using semantic similarity (LangChain + Gemini), and a REST API with JWT authentication and RBAC. Integrated resume scoring, dashboard analytics, and export options. Stack: Node.js, Express, MongoDB, AWS S3, LangChain, spaCy, PDF-lib, JWT.
---

## 🚀 Features

1. API To upload CV and Upload Job Description.
2. Output with Detail  Explanation, Candidate Details, Skills, Matching Skills and Unmatched Skills, Score.
3. This project has two API. In first API, Gemini is integrated without langchain, 2nd API use      langchain that explain CV strength in Positive points as well as Negative points.
4. Third API, to chat on CV, it use buffer memory, not a sustainable way to have chat until stored the in some database of Use ReDiS. 

---

## 🛠️ Tech Stack


- ⚙️ Backend: Node.js / Express.js
- 🗃️ Database: MongoDB
- langchain
- LLMs (Gemini)


---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
