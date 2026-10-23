from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Enterprise AI Investigation System",
    description="Dockerized enterprise AI investigation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "enterprise-ai"
    }


@app.post("/ask")
def ask_question(question: dict):
    return {
        "question": question.get("question", ""),
        "answer": "Enterprise AI Investigation System is running inside Docker.",
        "confidence": "High",
        "validation": True,
        "sources": [],
        "response_time": 0.001
    }