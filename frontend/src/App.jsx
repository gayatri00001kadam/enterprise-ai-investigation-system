import { useState } from "react";

import {
  MessageSquare,
  FileText,
  Network,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  CheckCircle2,
  Database,
  Brain,
  ShieldCheck,
} from "lucide-react";

import "./App.css";


function App() {
  // -----------------------------
  // State
  // -----------------------------

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(false);


  // -----------------------------
  // Ask FastAPI Backend
  // -----------------------------

  const askQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ask",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      setAnswer(data.answer || "No answer received.");

      setSources(data.sources || []);

    } catch (error) {
      console.error("API Error:", error);

      setAnswer(
        "Unable to connect to the AI backend. Please make sure FastAPI is running."
      );

      setSources([]);

    } finally {
      setLoading(false);
    }
  };


  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <Brain size={24} />
          </div>

          <div>
            <h2>Enterprise AI</h2>
            <p>Investigation System</p>
          </div>

        </div>


        <nav className="nav">

          <div className="nav-item active">
            <MessageSquare size={20} />
            <span>Chat</span>
          </div>

          <div className="nav-item">
            <FileText size={20} />
            <span>Documents</span>
          </div>

          <div className="nav-item">
            <Network size={20} />
            <span>Knowledge Graph</span>
          </div>

          <div className="nav-item">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </div>

          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>

        </nav>


        <div className="sidebar-bottom">

          <div className="user-avatar">
            <User size={20} />
          </div>

          <div>
            <strong>Admin User</strong>
            <small>admin@company.com</small>
          </div>

        </div>

      </aside>


      {/* =========================
          MAIN
      ========================== */}

      <main className="main">


        {/* TOP BAR */}

        <header className="topbar">

          <div className="search-box">

            <Search size={20} />

            <input
              placeholder="Ask a question about your company data..."
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askQuestion();
                }
              }}
            />

          </div>


          <div className="top-actions">

            <div className="status">
              <span></span>
              System Online
            </div>

            <Bell size={20} />

            <div className="profile">
              AU
            </div>

          </div>

        </header>



        {/* CONTENT */}

        <div className="content">


          {/* =========================
              CHAT PANEL
          ========================== */}

          <section className="chat-panel">


            <div className="chat-header">

              <div>

                <h1>
                  Enterprise AI Assistant
                </h1>

                <p>
                  Multi-Agent • Hybrid RAG • MLOps
                </p>

              </div>


              <div className="completed">

                <CheckCircle2 size={17} />

                {loading
                  ? "Processing..."
                  : "Ready"}

              </div>

            </div>



            {/* USER QUESTION */}

            {question && (

              <div className="user-message">

                <div className="message-avatar">
                  AU
                </div>

                <div>

                  <span className="message-label">
                    You
                  </span>

                  <p>
                    {question}
                  </p>

                </div>

              </div>

            )}



            {/* AI RESPONSE */}

            <div className="ai-response">


              <div className="ai-title">

                <div className="ai-icon">
                  <Brain size={20} />
                </div>

                <div>

                  <strong>
                    Enterprise AI Assistant
                  </strong>

                  <span>
                    {loading
                      ? "Analyzing..."
                      : answer
                        ? "Analysis completed"
                        : "Ready to investigate"}
                  </span>

                </div>

              </div>



              {/* LOADING */}

              {loading && (

                <div className="answer-section">

                  <h3>
                    <Brain size={19} />

                    Investigating...
                  </h3>

                  <p>
                    Retrieving relevant documents
                    and generating an evidence-based answer.
                  </p>

                </div>

              )}



              {/* ANSWER */}

              {!loading && answer && (

                <>

                  <div className="answer-section">

                    <h3>
                      <Database size={19} />

                      AI Answer
                    </h3>

                    <p>
                      {answer}
                    </p>

                  </div>


                  <div className="answer-section">

                    <h3>
                      <ShieldCheck size={19} />

                      Evidence Status
                    </h3>

                    <p>
                      Answer generated using retrieved
                      enterprise knowledge sources.
                    </p>

                  </div>


                  {/* SOURCES */}

                  <div className="sources">

                    <h3>
                      Sources
                    </h3>


                    <div className="source-list">

                      {sources.length > 0 ? (

                        sources.map(
                          (source, index) => (

                            <div
                              className="source-card"
                              key={index}
                            >

                              <FileText size={18} />

                              <div>

                                <strong>
                                  {source
                                    .split("\\")
                                    .pop()}
                                </strong>

                                <span>
                                  Enterprise Knowledge
                                </span>

                              </div>

                            </div>

                          )
                        )

                      ) : (

                        <p>
                          No sources returned.
                        </p>

                      )}

                    </div>

                  </div>

                </>

              )}



              {/* EMPTY STATE */}

              {!loading && !answer && (

                <div className="answer-section">

                  <h3>
                    <Brain size={19} />

                    Start an Investigation
                  </h3>

                  <p>
                    Ask a question about your company
                    knowledge base. The AI will retrieve
                    relevant evidence and generate an
                    answer with sources.
                  </p>

                </div>

              )}

            </div>



            {/* QUESTION INPUT */}

            <div className="question-input">

              <input
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askQuestion();
                  }
                }}
                placeholder="Ask another question..."
                disabled={loading}
              />


              <button
                onClick={askQuestion}
                disabled={
                  loading ||
                  !question.trim()
                }
              >

                <Search size={19} />

              </button>

            </div>


          </section>



          {/* =========================
              RIGHT PANEL
          ========================== */}

          <aside className="right-panel">


            {/* QUERY DETAILS */}

            <div className="card">

              <h2>
                Query Details
              </h2>


              <div className="detail">

                <span>
                  Query Type
                </span>

                <strong>
                  Technical Analysis
                </strong>

              </div>


              <div className="detail">

                <span>
                  Confidence Score
                </span>

                <strong>
                  {answer ? "High" : "--"}
                </strong>

              </div>


              <div className="detail">

                <span>
                  Response Status
                </span>

                <strong>
                  {loading
                    ? "Processing"
                    : answer
                      ? "Completed"
                      : "Waiting"}
                </strong>

              </div>


              <div className="detail">

                <span>
                  Sources Used
                </span>

                <strong>
                  {sources.length}
                </strong>

              </div>

            </div>



            {/* RETRIEVED SOURCES */}

            <div className="card">

              <h2>
                Retrieved Sources
              </h2>


              {sources.length > 0 ? (

                sources.map(
                  (source, index) => (

                    <div
                      className="source-mini"
                      key={index}
                    >

                      <FileText size={18} />

                      <div>

                        <strong>
                          {source
                            .split("\\")
                            .pop()}
                        </strong>

                        <span>
                          Retrieved from ChromaDB
                        </span>

                      </div>

                    </div>

                  )
                )

              ) : (

                <p>
                  No sources yet.
                </p>

              )}

            </div>



            {/* AGENT WORKFLOW */}

            <div className="card">

              <h2>
                Agent Workflow
              </h2>


              <div className="workflow">


                <div className="workflow-item">

                  <CheckCircle2 />

                  <div>

                    <strong>
                      1. Data Collector Agent
                    </strong>

                    <span>
                      Documents retrieved
                    </span>

                  </div>

                </div>


                <div className="workflow-line"></div>


                <div className="workflow-item">

                  <CheckCircle2 />

                  <div>

                    <strong>
                      2. Analyzer Agent
                    </strong>

                    <span>
                      Evidence analyzed
                    </span>

                  </div>

                </div>


                <div className="workflow-line"></div>


                <div className="workflow-item">

                  <CheckCircle2 />

                  <div>

                    <strong>
                      3. Validator Agent
                    </strong>

                    <span>
                      Answer validation
                    </span>

                  </div>

                </div>

              </div>


              <div className="process-complete">

                <CheckCircle2 size={18} />

                {answer
                  ? "Process Completed"
                  : "Ready"}

              </div>

            </div>


          </aside>

        </div>

      </main>

    </div>
  );
}


export default App;
