import language_tool_python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from keybert import KeyBERT
import numpy as np
from typing import Dict, Tuple


# =========================================================
# 1️⃣ Initialize Models (loaded once)
# =========================================================

# Grammar correction tool
tool = language_tool_python.LanguageTool("en-US")

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
    Clean and normalize text.
    - Fix grammar
    - Convert to lowercase
    """
    try:
        matches = tool.check(text)
        corrected = language_tool_python.utils.correct(text, matches)
        return corrected.lower().strip()

    except Exception:
        return text.lower().strip()


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
        model_answer, keyphrase_ngram_range=(1, 3), stop_words="english", top_n=8
    )

    keyword_phrases = [k[0].lower() for k in keywords]

    # -----------------------------
    # Step 3: Combine both
    # -----------------------------
    concepts = list(set(noun_phrases + keyword_phrases))

    # -----------------------------
    # Step 4: Remove generic terms
    # -----------------------------
    banned_words = {"tcp", "protocol", "data", "system", "method", "process"}

    filtered = []

    for concept in concepts:
        words = concept.split()

        # remove very short concepts
        if len(words) < 2:
            continue

        # remove banned terms
        if any(word in banned_words for word in words):
            continue

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
    Score student answer based on detected concepts.

    Instead of exact keyword match, we check
    semantic similarity between concept and student answer.
    """

    total = 0

    for concept, marks in rubric.items():
        similarity = semantic_similarity(concept, student_ans)

        if similarity >= 55:
            total += marks

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
    semantic: float, rubric_marks: float, max_marks: int, length_factor: float
) -> int:
    """
    Combine semantic similarity + rubric scoring.
    """

    rubric_percent = (rubric_marks / max_marks) * 100

    score = semantic * 0.6 + rubric_percent * 0.3 + (length_factor * 100) * 0.1

    return int(score)


# =========================================================
# 8️⃣ Marks Calculation
# =========================================================


def calculate_marks(accuracy: int, max_marks: int) -> float:
    """
    Convert accuracy percentage into exam marks.
    """

    if accuracy >= 90:
        return float(max_marks)

    elif accuracy >= 75:
        return round(max_marks * 0.75, 2)

    elif accuracy >= 50:
        return round(max_marks * 0.5, 2)

    elif accuracy >= 30:
        return round(max_marks * 0.25, 2)

    else:
        return 0.0


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

    return {
        "accuracy": accuracy,
        "marks": marks,
        "max_marks": max_marks,
        "evaluation": {
            "semantic_similarity": semantic,
            "rubric_marks": rubric_marks,
            "length_factor": length_factor,
            "rubric": rubric,
        },
    }
