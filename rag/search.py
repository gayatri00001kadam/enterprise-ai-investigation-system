from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


CHROMA_PATH = "chroma_db"


# Load the same embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Connect to our existing vector database
vector_store = Chroma(
    collection_name="enterprise_knowledge",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH,
)


# Ask a question
query = "Why did database timeout errors increase after deployment?"


# Search for relevant documents
results = vector_store.similarity_search(
    query,
    k=3
)


print("\nSEARCH RESULTS")
print("==============================")

for i, result in enumerate(results):
    print(f"\nRESULT {i + 1}")
    print("------------------------------")
    print("SOURCE:", result.metadata.get("source"))
    print("CONTENT:")
    print(result.page_content)