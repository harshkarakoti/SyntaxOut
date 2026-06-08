# 🚀 SyntaxOut

**SyntaxOut** is a modern, automated, AI-powered API documentation generator. It allows developers to upload source files (JavaScript, Python, Go, and more) and instantly outputs structured, interactive, and beautifully designed API documentation, complete with summaries, HTTP endpoints, classes, helper functions, constants, and module imports.

🔗 **Live Website:** [syntaxout.vercel.app](https://syntaxout.vercel.app/)  
🔗 **API Server:** [syntaxout-api.onrender.com](https://syntaxout-api.onrender.com)

---

## 🌟 Key Features

*   **⚡ Automated AI Static Code Analysis:** Powered by **Gemini 2.5 Flash** to analyze and extract API definitions, functions, and models without executing any code.
*   **🎯 Deterministic Output Schema:** Uses strict JSON schema enforcement (`response_format: { type: "json_object" }` with near-zero temperature) to ensure clean, valid data output.
*   **🖥️ Premium Glassmorphic UI:** A state-of-the-art dark-themed interface built with React 19, incorporating interactive code viewers, dynamic badge systems, and smooth transitions.
*   **🔒 Session-based Privacy:** Generates a randomized client ID per browser session. No sign-up or email is required. History is kept isolated, private, and local.
*   **🧹 MongoDB TTL Safety Net:** All session data is automatically deleted from the database after 24 hours via MongoDB TTL (Time To Live) index expiration, ensuring no persistent accumulation of user code.
*   **📦 Batch Parsing:** Supports uploading multiple code files in a single session, parsing them sequentially to respect rate limits while displaying individual parser statuses gracefully.

---

## 🛠️ Technology Stack

### Frontend
*   **Core:** React 19 (Hooks, custom state management)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS + Vanilla CSS (with custom-crafted inline styles ensuring 100% style stability in production environments)
*   **Icons:** Lucide React
*   **Routing:** React Router DOM (v7)
*   **API Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express (with global error boundaries and JSON parsers)
*   **AI Integration:** OpenAI Node.js SDK (configured with Google Generative AI OpenAI-compatible base URL)
*   **File Uploads:** Multer (handling multi-file memory-buffer uploads)
*   **Database:** MongoDB Atlas (via Mongoose)

---

## 📁 Repository Structure

```text
SyntaxOut/
├── backend/                  # Express API Server
│   ├── config/               # DB and AI Client configs
│   ├── controllers/          # Request handler functions
│   ├── models/               # MongoDB Mongoose schemas (Project, Module)
│   ├── routes/               # Express routing logic
│   ├── services/             # Core Gemini 2.5 Flash parsing pipeline
│   ├── server.js             # Main server entrypoint
│   └── package.json
└── frontend/                 # Vite + React Client
    ├── src/
    │   ├── components/       # Reusable UI parts (UploadZone, CodeViewer, SchemaTable, etc.)
    │   ├── pages/            # View Pages (HomePage, ProjectsPage, ProjectPage)
    │   ├── App.jsx           # Main router & app layout
    │   ├── index.css         # CSS tokens & custom scrollbars
    │   └── main.jsx
    ├── tailwind.config.js    # Tailwind configuration
    ├── vercel.json           # Vercel SPA routing fallback rewrite configuration
    └── package.json
```

---

## 📡 API Reference

### Health Check
*   **Endpoint:** `GET /api/v1/health`
*   **Description:** Returns the current API status, server environment, and system timestamp.

### File Upload & Parsing
*   **Endpoint:** `POST /api/v1/upload`
*   **Content-Type:** `multipart/form-data`
*   **Body Fields:**
    *   `clientId` (String) - Client identifier for session tracking.
    *   `files` (File[]) - Array of source code files to parse.
*   **Response:** Created Project details and status:
    ```json
    {
      "success": true,
      "project": {
        "id": "project_id",
        "name": "Session Upload - Jun 08",
        "fileCount": 3,
        "status": "processing"
      }
    }
    ```

### Direct JSON Parsing
*   **Endpoint:** `POST /api/v1/parse`
*   **Body Fields:**
    *   `code` (String) - Raw source code string.
    *   `filename` (String) - Filename including extension.
*   **Response:** Directly returns the parsed JSON documentation schema.

### Project History Retrieval
*   **Endpoint:** `GET /api/v1/projects`
*   **Query Params:**
    *   `clientId` (String) - Client session ID.
*   **Response:** List of projects created under the given session client ID, sorted by creation date.

---

## 🚀 Local Development Setup

Follow these steps to run both the frontend and backend locally.

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   A MongoDB database (local or Atlas)
*   A Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Configuration
1. Navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables:
   ```env
   PORT=5000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URI=your_mongodb_connection_string_here
   FRONTEND_URL=http://localhost:5173
   ```
5. Start the development server (runs with nodemon):
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Navigate into the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Define the backend endpoint URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
6. Open your browser to the local URL (usually `http://localhost:5173`).

---

## 🌐 Deploying to Production

### Backend (Render / Heroku)
When deploying the Express backend:
1. Ensure the `FRONTEND_URL` environment variable is set to your production frontend domain (e.g. `https://syntaxout.vercel.app`) to handle CORS rules gracefully.
2. Verify that `GEMINI_API_KEY` and `MONGO_URI` are properly configured in the settings platform.

### Frontend (Vercel)
When importing the repository to Vercel:
1. Set the **Root Directory** to `frontend`.
2. Add the environment variable `VITE_API_URL` pointing to your deployed API server URL (e.g. `https://syntaxout-api.onrender.com`).
3. Vercel will auto-detect Vite and apply the build configuration (`npm run build` and `dist` output folder).
4. The repo includes a `frontend/vercel.json` rewrite file to ensure React Router SPA pathing doesn't trigger 404 pages on refresh.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
