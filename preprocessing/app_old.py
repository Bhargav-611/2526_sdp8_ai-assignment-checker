from ocr_service import image_to_text_extraction
from evaluation_service import evaluattion_pipeline
from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI()


class OCRPathRequest(BaseModel):
    image_path: str


@app.post("/ocr-path")
def ocr_from_path(req: OCRPathRequest):
    # if not os.path.exists(req.image_path):
    #     return {"error": "Image path not found"}

    text = image_to_text_extraction(req.image_path)

    return {"image_path": req.image_path, "extracted_text": text}


class EvaluateTextRequest(BaseModel):
    question: str
    model_answer: str
    student_answer: str
    max_marks: int


@app.post("/evaluate-text")
def evaluate_text(req: EvaluateTextRequest):
    ai_response, marks, accuracy = evaluattion_pipeline(
        req.question, req.model_answer, req.student_answer, req.max_marks
    )

    return {
        "accuracy": accuracy,
        "marks": marks,
        "max_marks": req.max_marks,
        "evaluation": ai_response,
    }


class EvaluatePathRequest(BaseModel):
    image_path: str
    question: str
    model_answer: str
    max_marks: int


@app.post("/evaluate-path")
def evaluate_from_image_path(req: EvaluatePathRequest):

    # OCR
    student_answer = image_to_text_extraction(req.image_path)

    # Evaluation
    ai_response, marks, accuracy = evaluattion_pipeline(
        req.question, req.model_answer, student_answer, req.max_marks
    )

    print(student_answer, accuracy, marks, ai_response)

    return {
        "image_path": req.image_path,
        "student_answer": student_answer,
        "accuracy": accuracy,
        "marks": marks,
        "max_marks": req.max_marks,
        "evaluation": ai_response,
    }
