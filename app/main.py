from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File
from app.document_upload import save_uploaded_file
from agents.orchestrator import investigate
from app.document_upload import index_uploaded_document
from pathlib import Path




app = FastAPI(
    title="Enterprise AI Investigation System",
    description="RAG-powered enterprise AI backend",
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


class QuestionRequest(BaseModel):
    question: str


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "enterprise-ai"
    }

@app.post("/upload")
def upload_document(file: UploadFile = File(...)):
    file_path = save_uploaded_file(file)

    indexing_result = index_uploaded_document(file_path)

    return {
        "filename": file.filename,
        "message": "Document uploaded and indexed successfully.",
        "path": file_path,
        "indexed": indexing_result["indexed"]
    }

@app.delete("/documents/{filename}")
def delete_document(filename: str):
    file_path = Path("data/uploads") / filename

    if not file_path.exists():
        return {
            "deleted": False,
            "message": "Document not found."
        }

    file_path.unlink()

    return {
        "deleted": True,
        "filename": filename,
        "message": "Document deleted successfully."
    }

@app.post("/documents/{filename}/reindex")
def reindex_document(filename: str):
    file_path = Path("data/uploads") / filename

    if not file_path.exists():
        return {
            "indexed": False,
            "message": "Document not found."
        }

    indexing_result = index_uploaded_document(
        str(file_path)
    )

    return {
        "indexed": indexing_result["indexed"],
        "filename": filename,
        "message": "Document re-indexed successfully."
    }
    

@app.post("/ask")
def ask_question_endpoint(request: QuestionRequest):
    result = investigate(request.question)

    sources = [
        item["source"]
        for item in result["evidence"]
    ]

    return {
        "question": request.question,
        "answer": result["analysis"]["analysis"],
        "sources": sources,
        "confidence": result["validation"]["confidence"],
        "validation": result["validation"]["valid"],
        "reason": result["validation"]["reason"],
        "response_time": result["response_time"],
    }