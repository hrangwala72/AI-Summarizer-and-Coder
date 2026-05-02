import { useState } from 'react'
import axios from 'axios'
import { Sparkles, Code2, FileText, Upload, CheckCircle2, AlertCircle, Cpu } from 'lucide-react'
import './App.css'

function App() {
  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [codePrompt, setCodePrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [codeResult, setCodeResult] = useState('');
  const [activeModel, setActiveModel] = useState('Gemini 2.5');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [file, setFile] = useState(null);

  // FIXED: Added missing closing brace below
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  }; 

  // Summarizer Logic
  const handleSummarize = async () => {
    setSummaryLoading(true);
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post('http://localhost:5000/api/summarize-pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/summarize', { text: summaryText });
      }

      setSummaryResult(response.data.summary);
      setActiveModel(response.data.source);
      setFile(null); 
    } catch (error) {
        console.error(error);
    } 
    finally {
      setSummaryLoading(false);
    }
};

  // Code Gen Logic
  const handleGenerateCode = async () => {
    setCodeLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-code', { 
        prompt: codePrompt, 
        language: language 
      });
      setCodeResult(response.data.code);
      setActiveModel(response.data.source || 'Gemini 2.5');
    } 
    catch (error) {
      console.error(error);
    }
    setCodeLoading(false);
};

  return (
    <div className="app-layout">
      <header className="main-header">
        <div className="logo-section">
          <Sparkles className="sparkle-icon" />
          <h1>Insight Engine <span className="version-tag">v2.0</span></h1>
        </div>
        <div className="status-bar">
          <Cpu size={16} />
          <span>Active Engine: <strong>{activeModel}</strong></span>
        </div>
      </header>

      <main className="content-grid">
        <section className="glass-card">
          <div className="card-header">
            <FileText className="header-icon" />
            <h2>Document Summarizer</h2>
          </div>
          
          <div className="input-group">
            <textarea 
              placeholder="Paste text here..." 
              value={summaryText} 
              disabled={file !== null}
              onChange={(e) => setSummaryText(e.target.value)}
            />
  
            {file && (
              <div className="file-indicator fade-in">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Ready to summarize: <strong>{file.name}</strong></span>
                <button className="clear-file" onClick={() => setFile(null)}>✕</button>
              </div>
            )}

            <div className="action-bar">
              <label className="upload-btn">
                <Upload size={18} />
                <span>{file ? 'Change PDF' : 'Upload PDF'}</span>
                <input 
                  type="file" 
                  style={{display: 'none'}} 
                  accept=".pdf" 
                  onChange={onFileChange} 
                />
              </label>
              
              <button className="primary-btn" onClick={handleSummarize} disabled={summaryLoading}>
                {summaryLoading ? 'Processing...' : 'Generate Summary'}
                </button>
            </div>
          </div>
          {summaryResult && (
            <div classNamez="result-area fade-in">
              <div className="result-label"><CheckCircle2 size={14} /> Result</div>
              <p>{summaryResult}</p>
            </div>
          )}
        </section>

        <section className="glass-card">
          <div className="card-header">
            <Code2 className="header-icon" />
            <h2>Code Generator</h2>
          </div>
          
          <div className="input-group">
            <select className="lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="SQL">SQL</option>
              <option value="Java">Java</option>
            </select>
            <textarea 
              placeholder="Describe logic (e.g. A function to encrypt data)..." 
              value={codePrompt} 
              onChange={(e) => setCodePrompt(e.target.value)}
            />
            <button className="secondary-btn" onClick={handleGenerateCode} disabled={codeLoading}>
              {codeLoading ? 'Synthesizing...' : 'Generate Snippet'}
              </button>
          </div>

          {codeResult && (
            <div className="result-area code-result fade-in">
              <div className="result-label"><Code2 size={14} /> Generated {language}</div>
              <pre><code>{codeResult}</code></pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;