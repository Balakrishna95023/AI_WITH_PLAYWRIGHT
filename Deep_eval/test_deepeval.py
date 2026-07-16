import os

# Disable DeepEval cloud logging and telemetry
os.environ["DEEPEVAL_TELEMETRY_OPT_OUT"] = "YES"
os.environ["DEEPEVAL_DISABLE_API"] = "YES"


from deepeval import evaluate
from deepeval.test_case import LLMTestCase

from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    HallucinationMetric,
    ContextualRelevancyMetric,
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    ToxicityMetric,
    BiasMetric,
    SummarizationMetric,
    GEval
)

from ollama_model import OllamaModel


# -----------------------------
# Ollama Model Configuration
# -----------------------------

model = OllamaModel(
    model_name="llama3.2:3b"
)


# -----------------------------
# LLM Test Case
# -----------------------------

test_case = LLMTestCase(

    # User question / prompt
    input="""
    What is Playwright?
    """,


    # AI generated response
    actual_output="""
    Playwright is an open-source browser automation framework
    developed by Microsoft.
    It supports Chromium, Firefox, and WebKit browsers.
    It is used for end-to-end testing and web automation.
    """,


    # Expected ideal answer
    expected_output="""
    Playwright is a browser automation framework created by Microsoft.
    It allows developers and testers to automate web applications
    across Chromium, Firefox, and WebKit browsers.
    """,


    # Context used for RAG / knowledge validation
    retrieval_context=[
        """
        Playwright is an open-source browser automation framework
        developed by Microsoft.

        It supports Chromium, Firefox, and WebKit.

        Playwright is commonly used for end-to-end testing,
        web automation, and browser testing.
        """
    ],


    # Additional context
    context=[
        """
        Official Playwright documentation describes Playwright
        as a framework for reliable end-to-end browser automation.
        """
    ]
)



# -----------------------------
# Metrics
# -----------------------------

metrics = [

    AnswerRelevancyMetric(
        threshold=0.7,
        model=model
    ),


    FaithfulnessMetric(
        threshold=0.7,
        model=model
    ),


    HallucinationMetric(
        threshold=0.7,
        model=model
    ),


    ContextualRelevancyMetric(
        threshold=0.7,
        model=model
    ),


    ContextualPrecisionMetric(
        threshold=0.7,
        model=model
    ),


    ContextualRecallMetric(
        threshold=0.7,
        model=model
    ),


    ToxicityMetric(
        threshold=0.7,
        model=model
    ),


    BiasMetric(
        threshold=0.7,
        model=model
    ),


    SummarizationMetric(
        threshold=0.7,
        model=model
    ),


    # Custom evaluation
    GEval(
        name="Playwright Response Quality",

        criteria="""
        Evaluate the AI response based on:

        1. Technical correctness
        2. Playwright knowledge accuracy
        3. No hallucinated information
        4. Clear explanation
        5. Useful information for testers
        """,

        evaluation_steps=[
            "Check technical accuracy",
            "Check hallucination",
            "Check completeness",
            "Check usefulness"
        ],

        threshold=0.7,
        model=model
    )
]



# -----------------------------
# Run Evaluation
# -----------------------------

evaluate(
    test_cases=[
        test_case
    ],

    metrics=metrics
)