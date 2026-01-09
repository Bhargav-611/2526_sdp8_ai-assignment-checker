from openai import OpenAI
import re
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def openai_evaluate(question, model_ans, student_ans):
    prompt = f"""
Evaluate the student answer strictly based on correctness and meaning.


Question:
{question}


Model Answer:
{model_ans}


Student Answer:
{student_ans}


Return EXACTLY in this format:
Accuracy: <0-100>
Reason: <one sentence>
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a strict exam evaluator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            timeout=20,
            max_tokens=100
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Accuracy: 0\nReason: OpenAI error - {e}"   


# -----------------------------
# Extract Accuracy from AI response
# -----------------------------
def extract_accuracy(ai_response):
    match = re.search(r"Accuracy:\s*(\d+)", ai_response)
    return int(match.group(1)) if match else 0


# -----------------------------
# Calculate Marks Based on Accuracy
# -----------------------------
def calculate_marks(accuracy, max_marks):
    if accuracy >= 90:
        return max_marks
    elif accuracy >= 75:
        return round(max_marks * 0.75, 2)
    elif accuracy >= 50:
        return round(max_marks * 0.5, 2)
    elif accuracy >= 30:
        return round(max_marks * 0.25, 2)
    else:
        return 0


def evaluattion_pipeline(question, model_ans, student_ans, max_marks):
    # -----------------------------
    # Run AI Evaluation
    # -----------------------------
    ai_response = openai_evaluate(question, model_ans, student_ans)
    accuracy = extract_accuracy(ai_response)
    marks = calculate_marks(accuracy, max_marks)
    
    return ai_response, marks, accuracy

