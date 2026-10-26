import re

from transformers import pipeline


generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)


def analyze_evidence(query: str, evidence: list):
    """
    Analyze retrieved enterprise evidence.

    Simple uploaded-PDF SQL/code questions use a fast
    rule-based path to avoid unnecessary LLM inference.

    Other investigation questions use the local Qwen model.
    """

    if not evidence:
        return {
            "analysis": "No relevant evidence was found.",
            "evidence_count": 0
        }

    query_lower = query.lower()

    # ==========================================================
    # FAST PATH
    # Uploaded PDF + SQL / code / command questions
    # ==========================================================

    if (
        "uploaded pdf" in query_lower
        and (
            "sql" in query_lower
            or "code" in query_lower
            or "commands" in query_lower
        )
    ):
        pdf_evidence = [
            item
            for item in evidence
            if str(item.get("source", "")).lower().endswith(".pdf")
        ]

        if not pdf_evidence:
            return {
                "analysis": (
                    "No uploaded PDF evidence was retrieved."
                ),
                "evidence_count": 0
            }

        pdf_text = " ".join(
            item.get("content", "").lower()
            for item in pdf_evidence
        )

        # Actual SQL syntax patterns.
        # These are deliberately stricter to avoid treating
        # normal English words such as "updated" as SQL.
        sql_patterns = {
            "SELECT": r"\bselect\s+.+\s+from\s+",
            "INSERT": r"\binsert\s+into\s+",
            "UPDATE": r"\bupdate\s+\w+\s+set\s+",
            "DELETE": r"\bdelete\s+from\s+",
            "ALTER": r"\balter\s+(table|database)\s+",
            "CREATE TABLE": r"\bcreate\s+table\s+",
            "DROP TABLE": r"\bdrop\s+table\s+",
            "TRUNCATE TABLE": r"\btruncate\s+table\s+",
            "SQL QUERY/COMMAND": r"\bsql\s+(query|command)\b"
        }

        found_patterns = [
            name
            for name, pattern in sql_patterns.items()
            if re.search(pattern, pdf_text)
        ]

        if found_patterns:
            return {
                "analysis": (
                    "SQL code or commands were found in the uploaded PDF. "
                    f"Detected patterns: {', '.join(found_patterns)}."
                ),
                "evidence_count": len(pdf_evidence)
            }

        return {
            "analysis": (
                "No SQL code or commands were found in the uploaded PDF."
            ),
            "evidence_count": len(pdf_evidence)
        }

    # ==========================================================
    # STANDARD LLM ANALYSIS PATH
    # ==========================================================

    evidence_text = "\n\n".join(
        f"SOURCE: {item.get('source', 'unknown')}\n"
        f"{item.get('content', '')}"
        for item in evidence
    )

    prompt = f"""
You are an enterprise investigation analyst.

Answer the investigation question using ONLY the evidence provided.

STRICT RULES:
- Do not invent facts.
- Do not invent SQL, code, commands, numbers,
  configuration values, or recommendations.
- Do not use outside knowledge.
- If the evidence does not contain code, do NOT generate code.
- If the evidence does not contain the information requested,
  clearly say:
  "The provided evidence does not contain this information."
- You may only repeat facts that are explicitly present
  in the evidence.
- Keep the answer concise.
- Do not create examples and present them as facts.
- Do not convert normal text into SQL or code.
- Do not assume missing technical details.

EVIDENCE:
{evidence_text}

INVESTIGATION QUESTION:
{query}

ANALYSIS:
"""

    result = generator(
        prompt,
        max_new_tokens=40,
        do_sample=False
    )

    generated_text = result[0]["generated_text"]

    analysis = generated_text.split(
        "ANALYSIS:",
        1
    )[-1].strip()

    return {
        "analysis": analysis,
        "evidence_count": len(evidence)
    }