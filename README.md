# 🧠 Noura

Noura is a full-stack web application built using **React (frontend)** and **Node.js + Express (backend)** that intelligently organizes a student's study schedule. It turns syllabus content (PDF, DOCX, or plain text) into a **personalized daily study plan** based on the student's available time and deadlines.

---

## 🎯 Features

### 📥 1. Input Interface

- Upload a **PDF, DOCX**, or **text file** OR manually input topics/goals.
- Set:
  - 📅 **Deadline** (e.g., exam date)
  - ⏰ **Daily available hours**
  - 🗓 **Preferred study days**

### 🧠 2. NLP-Powered Topic Parsing

- Extracts **topics** and **subtopics** using Natural Language Processing.
- Groups and ranks them by **complexity** and logical **sequence**.
- Suggests **estimated time allocation** for each topic.

### 🗓 3. Smart Scheduling

- Generates a daily plan using:
  - Available time
  - Topic complexity
  - Deadlines
- Accounts for skipped days, weight, and constraints.

### 📊 4. Output Study Plan

- View as:
  - Calendar-style layout
  - Checklist-style interface
- Includes **progress tracking** for completed topics.

---

## 🎨 Figma Design

🖌️ [View UI/UX Design on Figma](https://www.figma.com/design/ijwNBbocmqfA5eo8n0lWG1/NOURA?node-id=0-1&t=mf21JEpCteVWpHM6-1) 

---

## 🛠 Tech Stack

### Frontend

- **React.js**
- **Tailwind CSS**
- Axios (for API communication)

### Backend

- **Node.js + Express**
- **Multer** (for file uploads)
- **pdf-parse**, **mammoth**, **textract** (for file parsing)
- **compromise.js**, **natural**, or **OpenAI API** (for NLP)

---

## 👨‍💻 Teammates & Contributions

| Team Member        | GitHub Username | Role & Contributions                                      |
|--------------------|-----------------|------------------------------------------------------------|
| Sounak Pal    | `syntherat`  | Backend development, Frontend development, deployment     |
| Anamika Rai  | `Anamika-1629`     | File parser integration (PDF, DOCX), API endpoints, Backend development   |
| Bhakti Chopra   | `bhaktichopra2`     | Frontend UI design, Progress tracking UI, Frontend development         |
| Priyanshu Singh  | `PriyanshuSingh10114`     | Smart scheduling algorithm, time allocation system, NLP logic integration         |

---

## 🧪 Running Locally

### Prerequisites

- Node.js (v16+)
- npm / yarn
- PG Admin/Neon.tech (optional for data persistence)

### 1. Clone the Repository

```bash
git clone https://github.com/syntherat/Noura2.0
cd Noura2.0
```

### 2. Setup Backend

```bash
cd server
npm install
# Create .env file and add necessary config (e.g., PORT, OPENAI_API_KEY)
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
# Create .env file and add necessary config (e.g., PORT, OPENAI_API_KEY)
npm start
```

---

## ☁️ Deployment Instructions

### 🔹 Deploying Backend (Node.js + Express)

1. Use services like **Render**, **Railway**, or **Vercel (Serverless Functions)**.
2. Configure environment variables (e.g., `PORT`, `OPENAI_API_KEY`, `DB_URI` if needed).

### 🔹 Deploying Frontend (React)

1. Build React app:
```bash
cd client
npm run build
```
2. Deploy to:
   - **Vercel**: Recommended for ease of CI/CD
   - **Netlify**
   - **GitHub Pages** (static build)

3. Connect frontend to backend by updating `axios` base URLs.

---

### 🛠 Fixing `pdf-parse` Crash (Important for Deployment)

The `pdf-parse` package sometimes tries to run a test using a local PDF file that doesn’t exist, which causes the backend to crash.

👉 **To fix this after `npm install` in the server directory:**

1. Open this file:

   ```
   node_modules/pdf-parse/index.js
   ```

2. **Replace the code inside `index.js` with the following:**

   ```js
   const Fs = require('fs');
   const Pdf = require('./lib/pdf-parse.js');

   module.exports = Pdf;

   // Disable automatic test execution
   let isDebugMode = false;

   // Optional: Enable debugging only if needed
   // if (process.env.PDF_PARSE_DEBUG) {
   //     isDebugMode = true;
   // }

   if (isDebugMode) {
       let PDF_FILE = './test/data/05-versions-space.pdf';
       let dataBuffer = Fs.readFileSync(PDF_FILE);
       Pdf(dataBuffer).then(function(data) {
           Fs.writeFileSync(`${PDF_FILE}.txt`, data.text, {
               encoding: 'utf8',
               flag: 'w'
           });
       }).catch(function(err) {
           console.error('PDF Parse Test Error:', err);
       });
   }
   ```

---

## 📦 API Endpoints (Backend)

| Endpoint             | Method | Description                             |
|----------------------|--------|-----------------------------------------|
| `/api/upload`        | POST   | Uploads syllabus file                   |
| `/api/parse`         | POST   | Parses uploaded file using NLP          |
| `/api/generate-plan` | POST   | Generates daily schedule from topics    |
| `/api/save-plan`     | POST   | (Optional) Save user plan               |

---

## 🧩 Optional Enhancements

- ✅ PassportJS and Express Sessions based authentication
- 💾 Save/load plans using PostgreSQL
- ⬇️ Export schedule as CSV or PDF
- 📱 Responsive design (mobile/tablet ready)

---

## 🙌 Acknowledgements

- [OpenAI API](https://platform.openai.com/)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)

---

✨ _Smart planning for smarter studying – turn chaos into clarity!_