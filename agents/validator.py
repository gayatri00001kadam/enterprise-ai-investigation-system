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

    important_terms = [
        "database",
        "connection pool",
        "timeout",
        "deployment",
        "version 2.5",
        "incident id",
        "inc-2026-001"
    ]

    supported_terms = [
        term
        for term in important_terms
        if term in analysis_lower and term in evidence_text
    ]

    # Exact incident ID validation
    if "inc-2026-001" in evidence_text:
        if "inc-2026-001" in analysis_lower:
            return {
                "valid": True,
                "confidence": "High",
                "reason": "The incident ID in the analysis exactly matches the retrieved evidence.",
                "supported_terms": supported_terms
            }

    if len(supported_terms) >= 3:
        return {
            "valid": True,
            "confidence": "High",
            "reason": "The analysis contains multiple facts supported by retrieved evidence.",
            "supported_terms": supported_terms
        }

    return {
        "valid": False,
        "confidence": "Low",
        "reason": "The analysis may contain claims that are not sufficiently supported by the retrieved evidence.",
        "supported_terms": supported_terms
    }