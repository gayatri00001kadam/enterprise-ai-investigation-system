from app.rag_service import vector_store
from graph.knowledge_graph import build_knowledge_graph, search_graph


def hybrid_search(query: str, k: int = 3):
    """
    Combine vector search and knowledge graph search.
    """

    # Build knowledge graph
    build_knowledge_graph()

    # Vector search
    vector_results = vector_store.similarity_search(
        query,
        k=k
    )

    vector_evidence = []

    for result in vector_results:
        vector_evidence.append({
            "source": result.metadata.get("source"),
            "content": result.page_content
        })

    # Graph search
    graph_result = search_graph(query)

    return {
        "vector_results": vector_evidence,
        "graph_results": graph_result
    }