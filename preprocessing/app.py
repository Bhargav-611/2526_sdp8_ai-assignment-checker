from ocr_service import image_to_text_extraction
from evaluation_service import evaluate_answer, stream_evaluate_answer
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import time
import json

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


# ==========================================
# STREAMING EVALUATE FROM IMAGE
# ==========================================

@app.post("/evaluate-path-stream")
def evaluate_from_image_path_stream(req: EvaluatePathRequest):
    
    def generate():
        start_time = time.time()
        
        def yield_event(step: str, status: str, time_ms: float = 0, data: dict = None):
            event = {"step": step, "status": status, "time_ms": round(time_ms, 2)}
            if data:
                event["data"] = data
            return json.dumps(event) + "\n"
        
        # Step 1: OCR Extraction
        yield yield_event("ocr", "running")
        step_start = time.time()
        student_answer = image_to_text_extraction(req.image_path)
        step_time = (time.time() - step_start) * 1000
        yield yield_event("ocr", "done", step_time, {"student_answer": student_answer})

        # Process the rest through evaluation service generator
        for event_json in stream_evaluate_answer(
            req.question, req.model_answer, student_answer, req.max_marks
        ):
            yield event_json
            
    return StreamingResponse(generate(), media_type="application/x-ndjson")

