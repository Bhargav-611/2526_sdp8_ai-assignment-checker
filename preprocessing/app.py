from ocr_service import image_to_text_extraction
from evaluation_service import evaluate_answer
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


# ==========================================
# OCR FROM IMAGE PATH
# ==========================================


class OCRPathRequest(BaseModel):
    image_path: str


@app.post("/ocr-path")
def ocr_from_path(req: OCRPathRequest):

    text = image_to_text_extraction(req.image_path)

    return {"image_path": req.image_path, "extracted_text": text}


# ==========================================
# EVALUATE TEXT DIRECTLY
# ==========================================


class EvaluateTextRequest(BaseModel):
    question: str
    model_answer: str
    student_answer: str
    max_marks: int


@app.post("/evaluate-text")
def evaluate_text(req: EvaluateTextRequest):

    result = evaluate_answer(
        req.question, req.model_answer, req.student_answer, req.max_marks
    )

    return result


# ==========================================
# OCR + EVALUATE FROM IMAGE
# ==========================================


class EvaluatePathRequest(BaseModel):
    image_path: str
    question: str
    model_answer: str
    max_marks: int


@app.post("/evaluate-path")
def evaluate_from_image_path(req: EvaluatePathRequest):

    # Step 1: OCR extraction
    student_answer = image_to_text_extraction(req.image_path)

    # Step 2: Evaluate answer
    result = evaluate_answer(
        req.question, req.model_answer, student_answer, req.max_marks
    )

    # result now includes: accuracy, marks, max_marks, evaluation (str),
    # student_answer_clean, semantic_similarity, rubric_marks, length_factor, rubric
    return {"image_path": req.image_path, "student_answer": student_answer, **result}

