from app.rag_service import vector_store


def collect_evidence(query: str, k: int = 3):
    """
    Retrieve relevant enterprise documents for the user's question.
    """

    results = vector_store.similarity_search(query, k=k)

    evidence = []

    for result in results:
        evidence.append({
            "source": result.metadata.get("source"),
            "content": result.page_content
        })

    return evidence