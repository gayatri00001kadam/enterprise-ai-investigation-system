from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from transformers import pipeline


CHROMA_PATH = "chroma_db"


# -------------------------------------------------
# 1. Load embedding model
# -------------------------------------------------

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# -------------------------------------------------
# 2. Connect to ChromaDB
# -------------------------------------------------

vector_store = Chroma(
    collection_name="enterprise_knowledge",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH,
)


# -------------------------------------------------
# 3. Load local LLM
# -------------------------------------------------

print("Loading local LLM...")

generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)


# -------------------------------------------------
# 4. User question
# -------------------------------------------------

query = "Why did database timeout errors increase after deployment?"


# -------------------------------------------------
# 5. Retrieve relevant documents
# -------------------------------------------------

results = vector_store.similarity_search(
    query,
    k=2
)


# -------------------------------------------------
# 6. Build context
# -------------------------------------------------

context_parts = []

for result in results:
    source = result.metadata.get("source")
    content = result.page_content

    context_parts.append(
        f"SOURCE: {source}\n{content}"
    )


context = "\n\n".join(context_parts)


# -------------------------------------------------
# 7. Create strict RAG prompt
# -------------------------------------------------

prompt = f"""
You are an enterprise investigation assistant.

Answer the user's question using ONLY the evidence in the
provided context.

Rules:
- Do not invent facts.
- Do not make assumptions.
- Do not add information that is not present in the context.
- If the context does not contain enough information, say:
  "The available evidence is insufficient to determine the cause."
- Give a concise answer.
- Mention the relevant source files.

CONTEXT:
{context}

QUESTION:
{query}

ANSWER:
"""


# -------------------------------------------------
# 8. Generate answer
# -------------------------------------------------

print("\nGenerating answer...\n")

result = generator(
    prompt,
    max_new_tokens=120,
    do_sample=False,
)


# -------------------------------------------------
# 9. Display answer
# -------------------------------------------------

generated_text = result[0]["generated_text"]

answer = generated_text.split("ANSWER:", 1)[-1].strip()


print("QUESTION")
print("==============================")
print(query)

print("\nANSWER")
print("==============================")
print(answer)

print("\nSOURCES")
print("==============================")

for result in results:
    print("-", result.metadata.get("source"))