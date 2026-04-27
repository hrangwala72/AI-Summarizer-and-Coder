import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // States for Summarizer
  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  
  // States for Code Generator
  const [codePrompt, setCodePrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [codeResult, setCodeResult] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/summarize', { text: summaryText });
      setSummaryResult(response.data.summary);
    } catch (error) {
      alert("Backend error! Is the Node.js server running?");
    }
    setLoading(false);
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-code', { 
        prompt: codePrompt, 
        language: language 
      });
      setCodeResult(response.data.code);
    } catch (error) {
      alert("Backend error! Is the Node.js server running?");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🚀 AI Multi-Tool</h1>
      
      {/* SECTION 1: SUMMARIZER */}
      <div className="card">
        <h3>📄 Text Summarizer</h3>
        <textarea 
          placeholder="Paste long text or articles here..." 
          value={summaryText} 
          onChange={(e) => setSummaryText(e.target.value)}
        />
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? 'Processing...' : 'Summarize'}
        </button>
        {summaryResult && (
          <div className="result-box">
            <strong>Summary:</strong>
            <p>{summaryResult}</p>
          </div>
        )}
      </div>

      {/* SECTION 2: CODE GENERATOR */}
      <div className="card">
        <h3>💻 AI Code Generator</h3>
        <div className="controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="SQL">SQL</option>
          </select>
        </div>
        <textarea 
          placeholder="Describe the code you need (e.g., 'A function to sort a list')..." 
          value={codePrompt} 
          onChange={(e) => setCodePrompt(e.target.value)}
        />
        <button className="code-btn" onClick={handleGenerateCode} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Code'}
        </button>
        {codeResult && (
          <div className="result-box code-output">
            <strong>Generated {language} Code:</strong>
            <pre><code>{codeResult}</code></pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App