from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


# Load API key from .env
load_dotenv()

# Where our documents are stored
DATA_PATH = Path("data")

# Where ChromaDB will store the vectors
CHROMA_PATH = "chroma_db"


# 1. Load documents
loader = DirectoryLoader(
    str(DATA_PATH),
    glob="*.md",
    loader_cls=TextLoader
)

documents = loader.load()

print(f"Loaded documents: {len(documents)}")


# 2. Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = text_splitter.split_documents(documents)

print(f"Created chunks: {len(chunks)}")


# 3. Create embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
print("Creating embeddings...")


# 4. Store embeddings in ChromaDB
vector_store = Chroma(
    collection_name="enterprise_knowledge",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH,
)

vector_store.add_documents(chunks)

print("Vector database created successfully!")