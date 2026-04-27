require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Notice the new import name here
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the new 2026 Client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- 1. Summarization Route ---
app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        
        // Using the 2026 standard model: Gemini 2.5 Flash
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Summarize this text in 3 bullet points: ${text}` }] }]
        });

        res.json({ summary: response.text });
    } catch (error) {
        console.error("Summarize Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- 2. Code Generation Route ---
app.post('/api/generate-code', async (req, res) => {
    try {
        const { prompt, language } = req.body;
        
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ 
                role: 'user', 
                parts: [{ text: `Write only the ${language} code for: ${prompt}. No explanations.` }] 
            }]
        });

        res.json({ code: response.text });
    } catch (error) {
        console.error("Code Gen Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});