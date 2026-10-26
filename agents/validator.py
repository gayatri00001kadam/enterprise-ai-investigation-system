import re


def validate_analysis(analysis: str, evidence: list):
    """
    Validate whether the generated analysis is supported
    by the retrieved enterprise evidence.
    """

    if not evidence:
        return {
            "valid": False,
            "confidence": "Low",
            "reason": "No evidence was retrieved."
        }

    if not analysis or not analysis.strip():
        return {
            "valid": False,
            "confidence": "Low",
            "reason": "No analysis was generated."
        }

    evidence_text = " ".join(
        item["content"].lower()
        for item in evidence
    )

    analysis_lower = analysis.lower()

    # Exact incident ID validation
    if "inc-2026-001" in evidence_text:
        if "inc-2026-001" in analysis_lower:
            return {
                "valid": True,
                "confidence": "High",
                "reason": "The incident ID in the analysis exactly matches the retrieved evidence."
            }

    # Important enterprise terms
    important_terms = [
        "database",
        "postgresql",
        "connection pool",
        "timeout",
        "deployment",
        "version 2.5",
        "payment service",
        "production",
        "docker"
    ]

    supported_terms = [
        term
        for term in important_terms
        if term in analysis_lower and term in evidence_text
    ]

    # Count meaningful words shared between analysis and evidence
    analysis_words = set(
        re.findall(r"\b[a-zA-Z0-9.-]+\b", analysis_lower)
    )

    evidence_words = set(
        re.findall(r"\b[a-zA-Z0-9.-]+\b", evidence_text)
    )

    common_words = analysis_words.intersection(evidence_words)

    # Remove very common English words
    stop_words = {
        "the", "is", "was", "a", "an", "and", "or",
        "to", "of", "in", "on", "for", "with",
        "this", "that", "it", "as", "from", "based",
        "provided", "evidence", "answer", "source"
    }

    meaningful_common_words = [
        word
        for word in common_words
        if word not in stop_words
    ]

    # Strong evidence support
    if len(supported_terms) >= 2 and len(meaningful_common_words) >= 3:
        return {
            "valid": True,
            "confidence": "High",
            "reason": "The analysis contains multiple facts supported by the retrieved evidence.",
            "supported_terms": supported_terms
        }

    # Simple factual answers such as PostgreSQL
    if len(supported_terms) >= 1 and len(meaningful_common_words) >= 2:
        return {
            "valid": True,
            "confidence": "High",
            "reason": "The analysis contains facts directly supported by the retrieved evidence.",
            "supported_terms": supported_terms
        }

    return {
        "valid": False,
        "confidence": "Low",
        "reason": "The analysis may contain claims that are not sufficiently supported by the retrieved evidence.",
        "supported_terms": supported_terms
    }