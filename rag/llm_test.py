from transformers import pipeline


print("Loading local LLM...")


generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)


prompt = """
You are an enterprise AI assistant.

Answer the question using only the information provided below.

Context:
Payment Service version 2.5 was deployed to production.
The deployment included changes to database connection handling.
After deployment, database timeout errors increased.
The investigation indicated that the database connection pool was reaching its configured limit.

Question:
Why did database timeout errors increase after deployment?
"""


print("\nGenerating answer...\n")

result = generator(
    prompt,
    max_new_tokens=150,
    do_sample=False,
)


print(result[0]["generated_text"])
