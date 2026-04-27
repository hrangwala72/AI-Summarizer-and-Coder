# AI Multi-Tool: Summarizer & Code Generator

A full-stack AI application that leverages Large Language Models (LLMs) to provide automated text summarization and instant code generation across multiple programming languages.

## 🚀 Project Overview

This project consists of two core developer tools integrated into a single responsive dashboard:

### 1. Text Summarizer
A tool designed to process long-form content, articles, or documentation. It uses the **Gemini 2.5 Flash** model to extract the most critical information and present it in a concise, bulleted format. 
* **Key Feature:** High-speed processing of large text blocks with "3-bullet" density logic.

### 2. AI Code Generator
A specialized tool for developers that generates clean, ready-to-use code snippets based on natural language descriptions.
* **Key Feature:** Supports multiple languages including Python, JavaScript, Java, C++, and SQL.
* **Zero-Filler Logic:** Engineered prompts ensure the AI returns *only* the code, making it ideal for rapid prototyping.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Axios, CSS3 |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Google Gemini API (@google/genai) |
| **Environment** | Dotenv (Security) |

---

## ⚙️ Architecture & Data Flow



The application follows a standard Client-Server architecture:
1.  **Frontend (React):** Captures user input and sends an asynchronous POST request using Axios.
2.  **Backend (Node.js):** Acts as a secure middleware to handle API keys and format the "System Prompts."
3.  **AI Layer (Gemini):** Processes the natural language request and returns a structured JSON response.

---

## 🔧 Installation & Setup

### Prerequisites
* Node.js (LTS version)
* A Google AI Studio API Key

### Backend Setup
1. Navigate to `/ai-tools-backend`
2. Create a `.env` file and add: `GEMINI_API_KEY=your_key_here`
3. Run `npm install`
4. Start with `node index.js`

### Frontend Setup
1. Navigate to `/ai-tools-frontend`
2. Run `npm install`
3. Start with `npm run dev`
