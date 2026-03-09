from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from keybert import KeyBERT
import numpy as np
import os
import re
import time
import json
from typing import Dict, Tuple, Any

# =========================================================
# 1️⃣ Initialize Models (loaded once)
# =========================================================


# Sentence embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Keyword extraction model
kw_model = KeyBERT()

nlp = spacy.load("en_core_web_sm")


# =========================================================
# 2️⃣ Text Cleaning
# =========================================================


def clean_text(text: str) -> str:
    """
    Fast text cleaning for OCR output.
    - lowercase
    - remove extra spaces
    - remove strange chars
    """

    text = text.lower()

    text = re.sub(r"[^a-z0-9\s]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# =========================================================
# 3️⃣ Semantic Similarity
# =========================================================


def semantic_similarity(text1: str, text2: str) -> float:
    """
    Calculate semantic similarity between two texts.
    Returns value between 0 and 100.
    """

    try:
        emb1 = model.encode(text1)
        emb2 = model.encode(text2)

        similarity = cosine_similarity([emb1], [emb2])[0][0]

        return float(similarity * 100)

    except Exception:
        return 0.0


# =========================================================
# 4️⃣ Auto Rubric Generation from Model Answer
# =========================================================


def generate_rubric(model_answer: str, max_marks: int) -> Dict[str, float]:
    """
    Generate rubric concepts automatically using:
    - noun phrase extraction
    - keyword ranking
    - duplicate removal
    """

    doc = nlp(model_answer.lower())

    # -----------------------------
    # Step 1: Extract noun phrases
    # -----------------------------
    noun_phrases = [chunk.text.strip() for chunk in doc.noun_chunks]

    # -----------------------------
    # Step 2: Extract key phrases
    # -----------------------------
    keywords = kw_model.extract_keywords(
        model_answer, keyphrase_ngram_range=(1, 1), stop_words="english", top_n=10
    )

    keyword_phrases = [k[0].lower() for k in keywords]

    # -----------------------------
    # Step 3: Combine both
    # -----------------------------
    concepts = list(set(noun_phrases + keyword_phrases))


    filtered = []

    for concept in concepts:
        words = concept.split()

        filtered.append(concept)

    # -----------------------------
    # Step 5: Remove similar phrases
    # -----------------------------
    final_concepts = []

    for concept in filtered:
        duplicate = False

        for existing in final_concepts:
            if concept in existing or existing in concept:
                duplicate = True
                break

        if not duplicate:
            final_concepts.append(concept)

    # limit to best 4 concepts
    final_concepts = final_concepts[:4]

    if not final_concepts:
        return {}

    # -----------------------------
    # Step 6: Assign marks
    # -----------------------------
    marks_per_concept = round(max_marks / len(final_concepts), 2)

    rubric = {concept: marks_per_concept for concept in final_concepts}

    return rubric


# =========================================================
# 5️⃣ Concept-Level Semantic Scoring
# =========================================================


def rubric_score(student_ans: str, rubric: Dict[str, float]) -> float:
    """
    Improved concept scoring.

    - compare concept with each sentence / chunk
    - helps OCR text
    - helps wrong spelling
    - helps long answers
    """

    total = 0

    # split into chunks (fast)
    parts = re.split(r"[.,;:\n]", student_ans)

    for concept, marks in rubric.items():

        best_similarity = 0

        for part in parts:

            part = part.strip()

            if not part:
                continue

            sim = semantic_similarity(concept, part)

            if sim > best_similarity:
                best_similarity = sim

        # strong match
        if best_similarity >= 60:
            total += marks

        # partial match
        elif best_similarity >= 45:
            total += marks * 0.5

    return total


# =========================================================
# 6️⃣ Length Penalty
# =========================================================


def length_penalty(model_ans: str, student_ans: str) -> float:
    """
    Penalize very short answers.
    """

    model_len = len(model_ans.split())
    student_len = len(student_ans.split())

    if student_len >= model_len * 0.7:
        return 1.0

    elif student_len >= model_len * 0.4:
        return 0.7

    else:
        return 0.4


# =========================================================
# 7️⃣ Final Accuracy
# =========================================================


def final_accuracy(
    semantic,
    rubric_marks,
    max_marks,
    length_factor,
):

    rubric_percent = (rubric_marks / max_marks) * 100

    # fallback when rubric fails
    if rubric_marks == 0 and semantic > 60:
        rubric_percent = semantic * 0.5

    score = (
        semantic * 0.7 +
        rubric_percent * 0.2 +
        (length_factor * 100) * 0.1
    )

    return int(score)


# =========================================================
# 8️⃣ Marks Calculation
# =========================================================


def calculate_marks(accuracy, max_marks):

    percent = accuracy / 100

    marks = percent * max_marks

    return round(marks, 2)


# =========================================================
# 9️⃣ Main Evaluation Pipeline
# =========================================================


def evaluate_answer(
    question: str, model_answer: str, student_answer: str, max_marks: int
) -> Dict:
    """
    Complete answer evaluation pipeline.
    """

    # --------------------------------------
    # Step 1: Clean text
    # --------------------------------------

    model_clean = clean_text(model_answer)
    student_clean = clean_text(student_answer)

    # --------------------------------------
    # Step 2: Semantic similarity
    # --------------------------------------

    semantic = semantic_similarity(model_clean, student_clean)

    # --------------------------------------
    # Step 3: Generate rubric automatically
    # --------------------------------------

    rubric = generate_rubric(model_clean, max_marks)

    # --------------------------------------
    # Step 4: Concept scoring
    # --------------------------------------

    rubric_marks = rubric_score(student_clean, rubric)

    # --------------------------------------
    # Step 5: Length penalty
    # --------------------------------------

    length_factor = length_penalty(model_clean, student_clean)

    # --------------------------------------
    # Step 6: Final accuracy
    # --------------------------------------

    accuracy = final_accuracy(semantic, rubric_marks, max_marks, length_factor)

    # --------------------------------------
    # Step 7: Convert to marks
    # --------------------------------------

    marks = calculate_marks(accuracy, max_marks)

    # Build human-readable evaluation string (Spring Boot deserializes as String)
    rubric_keys = ", ".join(rubric.keys()) if rubric else "N/A"
    evaluation_text = (
        f"Semantic Similarity: {semantic:.1f}% | "
        f"Rubric Score: {rubric_marks:.1f}/{max_marks} | "
        f"Length Factor: {length_factor:.1f} | "
        f"Key Concepts: {rubric_keys}"
    )

    return {
        "accuracy": accuracy,
        "marks": marks,
        "max_marks": max_marks,
        "evaluation": evaluation_text,
        "student_answer_clean": student_clean,   # grammar-corrected version
        "semantic_similarity": round(semantic, 2),
        "rubric_marks": round(rubric_marks, 2),
        "length_factor": round(length_factor, 2),
        "rubric": rubric,
    }

# =========================================================
# 🔟 Streaming Evaluation Pipeline
# =========================================================

def stream_evaluate_answer(
    question: str, model_answer: str, student_answer: str, max_marks: int
) -> Any:
    """
    Generator that yields progress events as JSON strings.
    """
    start_time = time.time()
    
    def yield_event(step: str, status: str, time_ms: float = 0, data: Dict = None):
        event = {"step": step, "status": status, "time_ms": round(time_ms, 2)}
        if data:
            event["data"] = data
        return json.dumps(event) + "\n"

    # --- Step 1: Clean text ---
    yield yield_event("cleaning", "running")
    step_start = time.time()
    model_clean = clean_text(model_answer)
    student_clean = clean_text(student_answer)
    step_time = (time.time() - step_start) * 1000
    yield yield_event("cleaning", "done", step_time)

    # --- Step 2: Semantic similarity ---
    yield yield_event("semantic", "running")
    step_start = time.time()
    semantic = semantic_similarity(model_clean, student_clean)
    step_time = (time.time() - step_start) * 1000
    yield yield_event("semantic", "done", step_time)

    # --- Step 3: Generate rubric automatically ---
    yield yield_event("rubric", "running")
    step_start = time.time()
    rubric = generate_rubric(model_clean, max_marks)
    step_time = (time.time() - step_start) * 1000
    yield yield_event("rubric", "done", step_time)

    # --- Step 4: Concept scoring ---
    yield yield_event("scoring", "running")
    step_start = time.time()
    rubric_marks = rubric_score(student_clean, rubric)
    length_factor = length_penalty(model_clean, student_clean)
    accuracy = final_accuracy(semantic, rubric_marks, max_marks, length_factor)
    marks = calculate_marks(accuracy, max_marks)
    step_time = (time.time() - step_start) * 1000
    yield yield_event("scoring", "done", step_time)

    # --- Step 5: Finalizing ---
    rubric_keys = ", ".join(rubric.keys()) if rubric else "N/A"
    evaluation_text = (
        f"Semantic Similarity: {semantic:.1f}% | "
        f"Rubric Score: {rubric_marks:.1f}/{max_marks} | "
        f"Length Factor: {length_factor:.1f} | "
        f"Key Concepts: {rubric_keys}"
    )

    final_result = {
        "accuracy": accuracy,
        "marks": marks,
        "max_marks": max_marks,
        "evaluation": evaluation_text,
        "student_answer_clean": student_clean,
        "semantic_similarity": round(semantic, 2),
        "rubric_marks": round(rubric_marks, 2),
        "length_factor": round(length_factor, 2),
        "rubric": rubric,
    }
    
    total_time = (time.time() - start_time) * 1000
    yield yield_event("final", "done", total_time, final_result)
