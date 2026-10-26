import { useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  Search,
  Activity,
  FileText,
  Network,
  Send,
  CheckCircle,
  Bot,
  ShieldCheck,
  GitBranch,
} from "lucide-react";

import Documents from "./Documents";

import "./App.css";


/* =========================================================
   CUSTOM KNOWLEDGE GRAPH NODE
========================================================= */

function GraphNode({ data }) {
  return (
    <div
      style={{
        minWidth: "150px",
        padding: "12px 16px",
        borderRadius: "10px",
        background: "white",
        border: "2px solid #2f6df6",
        color: "#172033",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: "600",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#2f6df6",
        }}
      />

      {data.label}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#2f6df6",
        }}
      />
    </div>
  );
}


const nodeTypes = {
  enterpriseNode: GraphNode,
};


function App() {

  const [activePage, setActivePage] = useState("chat");

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [sources, setSources] = useState([]);

  const [confidence, setConfidence] = useState("—");

  const [responseTime, setResponseTime] = useState("—");

  const [loading, setLoading] = useState(false);


  /* =========================================================
     ASK QUESTION
  ========================================================= */

  const askQuestion = async () => {

    if (!question.trim()) {
      return;
    }

    setLoading(true);

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
        throw new Error("Backend request failed");
      }


      const data = await response.json();


      setAnswer(
        data.answer ||
          "No answer returned by the investigation system."
      );


      setSources(data.sources || []);


      setConfidence(
        data.confidence || "—"
      );


      setResponseTime(
        data.response_time
          ? `${Number(data.response_time).toFixed(2)}s`
          : "—"
      );

    } catch (error) {

      console.error(error);

      setAnswer(
        "Unable to connect to the Enterprise AI backend. Please make sure FastAPI is running on port 8000."
      );

      setSources([]);

      setConfidence("Low");

      setResponseTime("—");

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     KNOWLEDGE GRAPH
  ========================================================= */

  const renderKnowledgeGraph = () => {

    const nodes = [

      {
        id: "payment",
        type: "enterpriseNode",
        position: {
          x: 400,
          y: 40,
        },
        data: {
          label: "Payment Service",
        },
      },

      {
        id: "postgres",
        type: "enterpriseNode",
        position: {
          x: 100,
          y: 200,
        },
        data: {
          label: "PostgreSQL",
        },
      },

      {
        id: "pool",
        type: "enterpriseNode",
        position: {
          x: 400,
          y: 200,
        },
        data: {
          label: "Connection Pool",
        },
      },

      {
        id: "timeout",
        type: "enterpriseNode",
        position: {
          x: 700,
          y: 200,
        },
        data: {
          label: "Database Timeout",
        },
      },

      {
        id: "docker",
        type: "enterpriseNode",
        position: {
          x: 100,
          y: 380,
        },
        data: {
          label: "Docker",
        },
      },

      {
        id: "version",
        type: "enterpriseNode",
        position: {
          x: 400,
          y: 380,
        },
        data: {
          label: "Version 2.5",
        },
      },

      {
        id: "incident",
        type: "enterpriseNode",
        position: {
          x: 700,
          y: 380,
        },
        data: {
          label: "INC-2026-001",
        },
      },

      {
        id: "production",
        type: "enterpriseNode",
        position: {
          x: 400,
          y: 540,
        },
        data: {
          label: "Production",
        },
      },
    ];


    const edges = [

      {
        id: "e1",
        source: "payment",
        target: "postgres",
        label: "uses",
        animated: true,
      },

      {
        id: "e2",
        source: "payment",
        target: "pool",
        label: "uses",
        animated: true,
      },

      {
        id: "e3",
        source: "payment",
        target: "docker",
        label: "deployed_as",
      },

      {
        id: "e4",
        source: "payment",
        target: "version",
        label: "current_version",
      },

      {
        id: "e5",
        source: "version",
        target: "production",
        label: "deployed_to",
      },

      {
        id: "e6",
        source: "version",
        target: "timeout",
        label: "caused_increase_in",
        animated: true,
      },

      {
        id: "e7",
        source: "incident",
        target: "payment",
        label: "affects",
        animated: true,
      },

      {
        id: "e8",
        source: "incident",
        target: "timeout",
        label: "involves",
      },

    ];


    return (

      <div
        style={{
          padding: "18px",
          width: "100%",
          minHeight: "calc(100vh - 76px)",
        }}
      >

        <div
          style={{
            background: "white",
            border: "1px solid #e3e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >

          {/* HEADER */}

          <div
            style={{
              padding: "22px 24px",
              borderBottom: "1px solid #e8ecf3",
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize: "19px",
              }}
            >
              Knowledge Graph Explorer
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#7d899e",
                fontSize: "12px",
              }}
            >
              Explore relationships between enterprise
              services, databases, incidents and deployments.
            </p>

          </div>


          {/* GRAPH */}

          <div
            style={{
              width: "100%",
              height: "650px",
              position: "relative",
              background: "#f8fafc",
            }}
          >

            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.25,
              }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            >

              <Background
                gap={20}
                size={1}
              />

              <Controls />

              <MiniMap />

            </ReactFlow>

          </div>

        </div>

      </div>
    );
  };


  /* =========================================================
     CHAT PAGE
  ========================================================= */

  const renderChat = () => {

    return (

      <div className="content">

        {/* LEFT CHAT PANEL */}

        <section className="chat-panel">

          <div className="chat-header">

            <div>

              <h1>
                Enterprise AI Investigation
              </h1>

              <p>
                Hybrid RAG + Multi-Agent Investigation System
              </p>

            </div>


            <div className="completed">

              <CheckCircle size={15} />

              Ready

            </div>

          </div>


          {/* USER MESSAGE */}

          <div className="user-message">

            <div className="message-avatar">
              U
            </div>


            <div>

              <div className="message-label">
                INVESTIGATION QUERY
              </div>


              <p>
                {question ||
                  "Ask an enterprise investigation question..."}
              </p>

            </div>

          </div>


          {/* AI RESPONSE */}

          <div className="ai-response">

            <div className="ai-title">

              <div className="ai-icon">

                <Bot size={20} />

              </div>


              <div>

                <strong>
                  AI Investigation Analyst
                </strong>

                <span>
                  Evidence validated
                </span>

              </div>

            </div>


            {/* ANSWER */}

            <div className="answer-section">

              <h3>

                <Activity size={16} />

                Analysis

              </h3>


              <p>

                {loading
                  ? "Investigating enterprise evidence..."
                  : answer ||
                    "Your investigation answer will appear here after you submit a question."}

              </p>

            </div>


            {/* CONCLUSION */}

            <div className="conclusion">

              <strong>
                Investigation Status
              </strong>


              <p>
                Confidence: {confidence}
              </p>


              <p>
                Response time: {responseTime}
              </p>

            </div>


            {/* SOURCES */}

            <div className="sources">

              <h3>
                Evidence Sources
              </h3>


              <div className="source-list">

                {sources.length === 0 ? (

                  <div className="source-card">

                    <FileText size={18} />

                    <div>

                      <strong>
                        No sources yet
                      </strong>

                      <span>
                        Run an investigation query.
                      </span>

                    </div>

                  </div>

                ) : (

                  sources.map(
                    (source, index) => (

                      <div
                        className="source-card"
                        key={`${source}-${index}`}
                      >

                        <FileText size={18} />

                        <div>

                          <strong>
                            {source}
                          </strong>

                          <span>
                            Retrieved evidence
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>


          {/* QUESTION INPUT */}

          <div className="question-input">

            <input
              type="text"
              placeholder="Ask an investigation question..."
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {

                if (event.key === "Enter") {
                  askQuestion();
                }

              }}
            />


            <button
              onClick={askQuestion}
              disabled={loading}
            >

              <Send size={18} />

            </button>

          </div>

        </section>


        {/* RIGHT PANEL */}

        <aside className="right-panel">


          {/* INVESTIGATION DETAILS */}

          <div className="card">

            <h2>
              Investigation Details
            </h2>


            <div className="detail">

              <span>
                System
              </span>

              <strong>
                Enterprise AI
              </strong>

            </div>


            <div className="detail">

              <span>
                Retrieval
              </span>

              <strong>
                Hybrid RAG
              </strong>

            </div>


            <div className="detail">

              <span>
                Vector DB
              </span>

              <strong>
                ChromaDB
              </strong>

            </div>


            <div className="detail">

              <span>
                Knowledge Graph
              </span>

              <strong>
                NetworkX
              </strong>

            </div>

          </div>


          {/* AGENT WORKFLOW */}

          <div className="card">

            <h2>
              Agent Workflow
            </h2>


            <div className="workflow-item">

              <GitBranch size={20} />

              <div>

                <strong>
                  Collector
                </strong>

                <span>
                  Evidence retrieval
                </span>

              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-item">

              <Bot size={20} />

              <div>

                <strong>
                  Analyzer
                </strong>

                <span>
                  Evidence analysis
                </span>

              </div>

            </div>


            <div className="workflow-line" />


            <div className="workflow-item">

              <ShieldCheck size={20} />

              <div>

                <strong>
                  Validator
                </strong>

                <span>
                  Evidence validation
                </span>

              </div>

            </div>


            <div className="process-complete">

              <CheckCircle size={15} />

              Investigation pipeline ready

            </div>

          </div>

        </aside>

      </div>
    );
  };


  /* =========================================================
     TOP BAR
  ========================================================= */

  const renderTopbar = () => {

    return (

      <div className="topbar">

        <div className="search-box">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search investigations..."
          />

        </div>


        <div className="top-actions">

          <div className="status">

            <span />

            System Healthy

          </div>


          <div className="profile">
            GA
          </div>

        </div>

      </div>
    );
  };


  /* =========================================================
     MAIN APP
  ========================================================= */

  return (

    <div className="app">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">

            <Activity size={22} />

          </div>


          <div>

            <h2>
              Enterprise AI
            </h2>

            <p>
              Investigation Platform
            </p>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="nav">


          {/* INVESTIGATION */}

          <div
            className={`nav-item ${
              activePage === "chat"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("chat")
            }
          >

            <Activity size={20} />

            <span>
              Investigation
            </span>

          </div>


          {/* DOCUMENTS */}

          <div
            className={`nav-item ${
              activePage === "documents"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("documents")
            }
          >

            <FileText size={20} />

            <span>
              Documents
            </span>

          </div>


          {/* KNOWLEDGE GRAPH */}

          <div
            className={`nav-item ${
              activePage === "knowledge-graph"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("knowledge-graph")
            }
          >

            <Network size={20} />

            <span>
              Knowledge Graph
            </span>

          </div>

        </nav>


        {/* USER */}

        <div className="sidebar-bottom">

          <div className="user-avatar">
            GA
          </div>


          <div>

            <strong>
              Gayatri
            </strong>

            <small>
              AI Engineer
            </small>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        {renderTopbar()}


        {/* CHAT / INVESTIGATION */}

        {activePage === "chat" &&
          renderChat()}


        {/* DOCUMENTS */}

        {activePage === "documents" && (
          <Documents />
        )}


        {/* KNOWLEDGE GRAPH */}

        {activePage === "knowledge-graph" &&
          renderKnowledgeGraph()}

      </main>

    </div>
  );
}


export default App;