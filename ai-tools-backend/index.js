require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios'); // Required for Groq and Mistral
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 1. INITIALIZE GEMINI (Primary Engine)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- THE FAILOVER ENGINE (THE WATERFALL) ---
const generateWithFailover = async (prompt) => {
    // Attempt 1: Gemini
    try {
        console.log("Attempting Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { text: response.text(), source: "Gemini 2.5" };
    } catch (err) {
        console.warn("Gemini failing... falling back to Groq.");
    }

    // Attempt 2: Groq (Llama 3)
    try {
        console.log("Attempting Groq...");
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            // TRY CHANGING THIS MODEL NAME IF IT STILL FAILS
            model: "llama-3.3-70b-versatile", 
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return { text: response.data.choices[0].message.content, source: "Groq (Llama 3)" };
    } catch (err) {
        // THIS LINE IS KEY: It will tell you exactly why Groq is mad
        console.error("Groq Error Detail:", err.response?.data || err.message);
        console.warn("Groq failing... falling back to Mistral.");
    }

    // Attempt 3: Mistral AI
    try {
        console.log("Attempting Mistral...");
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: "mistral-tiny",
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` }
        });
        return { text: response.data.choices[0].message.content, source: "Mistral AI" };
    } catch (err) {
        throw new Error("All AI engines are currently unavailable.");
    }
};

// --- ROUTE 1: PDF SUMMARIZER (Gemini Native) ---
app.post('/api/summarize-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const pdfData = req.file.buffer.toString('base64');
        const prompt = "Please provide a professional summary of this document in 3-5 bullet points.";

        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { mimeType: "application/pdf", data: pdfData } }
        ]);

        const response = await result.response;
        res.json({ summary: response.text(), source: "Gemini 2.5 (PDF Engine)" });
    } catch (error) {
        res.status(500).json({ error: "Gemini PDF processing failed." });
    }
});

// --- ROUTE 2: TEXT SUMMARIZER (With Failover) ---
app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        const result = await generateWithFailover(`Summarize this text: ${text}`);
        res.json({ summary: result.text, source: result.source });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROUTE 3: CODE GENERATOR (With Failover) ---
app.post('/api/generate-code', async (req, res) => {
    try {
        const { prompt, language } = req.body;
        const result = await generateWithFailover(`Write ${language} code for: ${prompt}. Return ONLY the code.`);
        res.json({ code: result.text, source: result.source });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Insight Engine Server ready at http://localhost:${PORT}`);
});