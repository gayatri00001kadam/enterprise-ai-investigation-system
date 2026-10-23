from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from transformers import pipeline


CHROMA_PATH = "chroma_db"


print("Loading embedding model...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


print("Connecting to ChromaDB...")

vector_store = Chroma(
    collection_name="enterprise_knowledge",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH,
)


print("Loading local LLM...")

generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)


print("RAG service loaded successfully!")



def ask_question(query: str):

    # Retrieve relevant documents
    results = vector_store.similarity_search(
        query,
        k=2
    )

    # Build context
    context_parts = []

    for result in results:
        source = result.metadata.get("source")
        content = result.page_content

        context_parts.append(
            f"SOURCE: {source}\n{content}"
        )

    context = "\n\n".join(context_parts)

    # Create RAG prompt
    prompt = f"""
You are an enterprise investigation assistant.

Answer the user's question using ONLY the evidence
provided in the context.

Rules:
- Do not invent facts.
- Do not make assumptions.
- Do not add information that is not present.
- Give a concise answer.

CONTEXT:
{context}

QUESTION:
{query}

ANSWER:
"""

    # Generate answer
    result = generator(
        prompt,
        max_new_tokens=120,
        do_sample=False,
    )

    generated_text = result[0]["generated_text"]

    answer = generated_text.split(
        "ANSWER:",
        1
    )[-1].strip()

    # Collect sources
    sources = []

    for result in results:
        source = result.metadata.get("source")

        if source not in sources:
            sources.append(source)

    return {
        "answer": answer,
        "sources": sources
    }