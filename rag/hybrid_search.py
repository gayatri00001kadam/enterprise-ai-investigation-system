from pathlib import Path

from app.rag_service import vector_store
from graph.knowledge_graph import build_knowledge_graph, search_graph


def hybrid_search(query: str, k: int = 3):
    build_knowledge_graph()

    query_lower = query.lower()

    # If the user specifically asks about an uploaded PDF,
    # prefer the uploaded PDF instead of unrelated enterprise documents.
    if "uploaded" in query_lower and "pdf" in query_lower:
        pdf_files = sorted(
            Path("data/uploads").glob("*.pdf"),
            key=lambda path: path.stat().st_mtime,
            reverse=True
        )

        if pdf_files:
            pdf_source = str(pdf_files[0])

            vector_results = vector_store.similarity_search(
                query,
                k=k,
                filter={"source": pdf_source}
            )
        else:
            vector_results = vector_store.similarity_search(query, k=k)
    else:
        vector_results = vector_store.similarity_search(query, k=k)

    vector_evidence = []

    for result in vector_results:
        vector_evidence.append({
            "source": result.metadata.get("source"),
            "content": result.page_content
        })

    graph_result = search_graph(query)

    return {
        "vector_results": vector_evidence,
        "graph_results": graph_result
    }