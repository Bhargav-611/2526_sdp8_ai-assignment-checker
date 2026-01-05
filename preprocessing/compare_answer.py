from openai import OpenAI
import re


# 🔐 Make sure to set API key in environment variable or here for testing
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")


# -----------------------------
# OpenAI Evaluation Function
# -----------------------------
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


# -----------------------------
# Example Question
# -----------------------------
question = "What is Machine Learning?"
max_marks = 6  # Question total marks


model_ans = (
    "Machine learning is a branch of artificial intelligence that enables "
    "computers to learn patterns from data and make decisions without being "
    "explicitly programmed."
)


student_ans = (
    ''' "Machine learning is a branch of artificial intelligence that enables "
    "computers to learn patterns from data and make decisions without being "
    "explicitly programmed."'''
    )


# -----------------------------
# Run AI Evaluation
# -----------------------------
ai_response = openai_evaluate(question, model_ans, student_ans)
accuracy = extract_accuracy(ai_response)
marks = calculate_marks(accuracy, max_marks)


# -----------------------------
# Final Output
# -----------------------------
print("AI Response:\n", ai_response)
print(f"Calculated Marks: {marks}/{max_marks}")



