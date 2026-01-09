## 🛠️ Setup & Run Instructions

Create Virtual Environment
python -m venv venv


Windows
venv\Scripts\activate

Linux / Mac
source venv/bin/activate

📦 Install Dependencies
pip install -r requirements.txt

Create a file named .env in the project root:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx


Run the API Server
uvicorn app:app --host 0.0.0.0 --port 8000

1️⃣ OCR from Image Path

POST /ocr-path

{
  "image_path": "photos/test.jpg"
}

2️⃣ Evaluate Text Only

POST /evaluate-text

{
  "question": "What is Machine Learning?",
  "model_answer": "Machine learning is a branch of AI",
  "student_answer": "Machine learning is part of artificial intelligence",
  "max_marks": 6
}

3️⃣ OCR + Evaluation (Main API)

POST /evaluate-path

{
  "image_path": "photos/test.jpg",
  "question": "What is Machine Learning?",
  "model_answer": "Machine learning is a branch of artificial intelligence",
  "max_marks": 6
}