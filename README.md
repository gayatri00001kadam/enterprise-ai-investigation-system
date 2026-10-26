# Enterprise AI Investigation System

An enterprise AI investigation platform combining Hybrid RAG, Knowledge Graphs, Multi-Agent AI, and automated evidence validation.

## Evaluation

**4/4 tests passed — 100% evaluation score**

## Core Features

- Hybrid Vector + Graph Retrieval
- Local Hugging Face Embeddings
- Local Qwen LLM
- Multi-Agent Investigation Workflow
- Evidence Validation
- Confidence Scoring
- FastAPI Backend
- React/Vite Frontend
- NetworkX Knowledge Graph
- Document Upload and Reindexing
- Docker Deployment Smoke Test

## Architecture

```text
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
Orchestrator
  ↓
Collector → Analyzer → Validator
  ↓
Hybrid RAG
  ↓
Vector Database + Knowledge Graph
  ↓
Local Qwen LLM
  ↓
Validated Investigation Answer



## Project Structure

```text
enterprise-ai/
├── agents/
├── app/
├── data/
├── frontend/
├── graph/
├── rag/
├── tests/
├── Dockerfile
├── requirements.txt
└── README.md