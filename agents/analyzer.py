from transformers import pipeline


# Load local LLM
generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)


def analyze_evidence(query: str, evidence: list):
    """
    Analyze retrieved enterprise evidence using a local LLM.
    """

    if not evidence:
        return {
            "analysis": "No relevant evidence was found.",
            "evidence_count": 0
        }

    evidence_text = "\n\n".join(
        f"SOURCE: {item['source']}\n{item['content']}"
        for item in evidence
    )

    prompt = f"""
You are an enterprise investigation analyst.

Answer the investigation question using ONLY the evidence provided.

Rules:
- Do not invent facts.
- Do not make assumptions.
- Do not use outside knowledge.
- Clearly explain the likely cause using the evidence.
- Keep the answer concise.

EVIDENCE:
{evidence_text}

INVESTIGATION QUESTION:
{query}

ANALYSIS:
"""

    result = generator(
        prompt,
        max_new_tokens=150,
        do_sample=False
    )

    generated_text = result[0]["generated_text"]

    analysis = generated_text.split("ANALYSIS:", 1)[-1].strip()

    return {
        "analysis": analysis,
        "evidence_count": len(evidence)
    }