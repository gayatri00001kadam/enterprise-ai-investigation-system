from pathlib import Path
import shutil

from pypdf import PdfReader
from langchain_core.documents import Document

from app.rag_service import vector_store


UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_uploaded_file(upload_file):
    file_path = UPLOAD_DIR / upload_file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return str(file_path)


def extract_text(file_path: str):
    path = Path(file_path)

    if path.suffix.lower() == ".pdf":
        reader = PdfReader(file_path)

        text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

        return text

    return path.read_text(encoding="utf-8")


def index_uploaded_document(file_path: str):
    text = extract_text(file_path)

    if not text.strip():
        return {
            "indexed": False,
            "source": file_path,
            "error": "No readable text found in the document."
        }

    document = Document(
        page_content=text,
        metadata={"source": file_path}
    )

    vector_store.add_documents([document])

    return {
        "indexed": True,
        "source": file_path
    }