import networkx as nx


# Create the knowledge graph
graph = nx.DiGraph()


def build_knowledge_graph():
    """
    Build a simple enterprise knowledge graph
    from the known Payment Service relationships.
    """

    # Nodes
    graph.add_node("Payment Service", type="service")
    graph.add_node("PostgreSQL", type="database")
    graph.add_node("Connection Pool", type="component")
    graph.add_node("Docker", type="technology")
    graph.add_node("Version 2.5", type="version")
    graph.add_node("Production", type="environment")
    graph.add_node("Database Timeout", type="incident")
    graph.add_node("INC-2026-001", type="incident")

    # Relationships
    graph.add_edge(
        "Payment Service",
        "PostgreSQL",
        relation="uses"
    )

    graph.add_edge(
        "Payment Service",
        "Connection Pool",
        relation="uses"
    )

    graph.add_edge(
        "Payment Service",
        "Docker",
        relation="deployed_as"
    )

    graph.add_edge(
        "Payment Service",
        "Version 2.5",
        relation="current_version"
    )

    graph.add_edge(
        "Version 2.5",
        "Production",
        relation="deployed_to"
    )

    graph.add_edge(
        "Version 2.5",
        "Database Timeout",
        relation="caused_increase_in"
    )

    graph.add_edge(
        "INC-2026-001",
        "Payment Service",
        relation="affects"
    )

    graph.add_edge(
        "INC-2026-001",
        "Database Timeout",
        relation="involves"
    )

    return graph


def get_graph():
    """
    Return the enterprise knowledge graph.
    """

    return graph


def search_graph(query: str):
    """
    Search the knowledge graph for entities
    related to the query.
    """

    query_lower = query.lower()

    matches = []

    for node in graph.nodes:
        if any(word in node.lower() for word in query_lower.split()):
            matches.append(node)

    relationships = []

    for source, target, data in graph.edges(data=True):
        if source in matches or target in matches:
            relationships.append({
                "source": source,
                "target": target,
                "relation": data["relation"]
            })

    return {
        "nodes": matches,
        "relationships": relationships
    }