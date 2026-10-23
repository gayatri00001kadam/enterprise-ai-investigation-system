from rag.hybrid_search import hybrid_search
from agents.analyzer import analyze_evidence
from agents.validator import validate_analysis
from app.metrics import start_timer, elapsed_time


def investigate(query: str):
    """
    Run the complete multi-agent investigation workflow.
    """

    start_time = start_timer()

    # Step 1: Collect evidence
    hybrid_result = hybrid_search(query)

    vector_evidence = hybrid_result["vector_results"]
    graph_result = hybrid_result["graph_results"]

    graph_evidence = []

    for relationship in graph_result["relationships"]:
        graph_evidence.append({
            "source": "knowledge_graph",
            "content": (
                f"{relationship['source']} "
                f"{relationship['relation']} "
                f"{relationship['target']}"
            )
        })

    evidence = vector_evidence + graph_evidence

    # Step 2: Analyze evidence
    analysis_result = analyze_evidence(query, evidence)

    # Step 3: Validate analysis
    validation_result = validate_analysis(
        analysis_result["analysis"],
        evidence
    )

    total_time = elapsed_time(start_time)

    return {
        "query": query,
        "evidence": evidence,
        "analysis": analysis_result,
        "validation": validation_result,
        "response_time": total_time
    }