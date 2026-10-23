from tests.evaluation_questions import evaluation_questions
from agents.orchestrator import investigate


def run_evaluation():
    total = len(evaluation_questions)
    passed = 0

    print("\n=== Enterprise AI Evaluation ===\n")

    for index, item in enumerate(evaluation_questions, start=1):
        question = item["question"]
        expected_sources = item["expected_sources"]

        print(f"Test {index}: {question}")

        result = investigate(question)

        actual_sources = result["evidence"]

        actual_source_names = [
            evidence["source"]
            for evidence in actual_sources
        ]

        source_match = any(
            source in actual_source_names
            for source in expected_sources
        )

        validation_pass = result["validation"]["valid"]

        print(f"Source Retrieval: {'PASS' if source_match else 'FAIL'}")
        print(f"Validation: {'PASS' if validation_pass else 'FAIL'}")

        if source_match and validation_pass:
           status = "PASS"
           passed += 1
        else:
            status = "FAIL"
        print(f"Status: {status}")
        print(f"Status: {status}")
        print(f"Confidence: {result['validation']['confidence']}")
        print(f"Sources: {actual_source_names}")
        print()

    print("=== Evaluation Summary ===")
    print(f"Passed: {passed}/{total}")

    accuracy = (passed / total) * 100
    print(f"Evaluation Score: {accuracy:.1f}%")


if __name__ == "__main__":
    run_evaluation()