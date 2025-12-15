import cv2
import torch
import numpy as np
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import logging

# --------------------------------
# Suppress HF warnings (optional)
# --------------------------------
logging.getLogger("transformers").setLevel(logging.ERROR)

# --------------------------------
# Load TrOCR Printed Model
# --------------------------------
def load_model():
    processor = TrOCRProcessor.from_pretrained(
        "microsoft/trocr-base-handwritten",
        use_fast=True
    )

    model = VisionEncoderDecoderModel.from_pretrained(
        "microsoft/trocr-base-handwritten"
    )

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    return processor, model, device

# --------------------------------
# Preprocess image (printed-safe)
# --------------------------------
def preprocess_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError("Image path is incorrect")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # light denoising (safe for printed)
    gray = cv2.fastNlMeansDenoising(gray, h=10)

    return gray

# --------------------------------
# Line Segmentation using OpenCV
# --------------------------------
def segment_lines(gray):
    # Binary for projection
    _, thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    # Horizontal projection
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 1))
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    contours, _ = cv2.findContours(
        dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # Sort top to bottom
    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[1])

    lines = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if h > 15:  # ignore noise
            line = gray[y:y+h, x:x+w]
            lines.append(line)

    return lines

# --------------------------------
# OCR each line
# --------------------------------
def ocr_lines(lines, processor, model, device):
    full_text = []

    for line in lines:
        pil_img = Image.fromarray(line).convert("L")
        pil_img = pil_img.resize((1024, 128))

        pixel_values = processor(
            images=pil_img, return_tensors="pt"
        ).pixel_values.to(device)

        with torch.no_grad():
            ids = model.generate(pixel_values, max_length=128)

        text = processor.batch_decode(
            ids, skip_special_tokens=True
        )[0]

        if text.strip():
            full_text.append(text)

    return "\n".join(full_text)

# --------------------------------
# MAIN
# --------------------------------
if __name__ == "__main__":
    image_path = "test.png"  # your printed document image

    processor, model, device = load_model()

    gray = preprocess_image(image_path)

    lines = segment_lines(gray)

    final_text = ocr_lines(lines, processor, model, device)

    print("========== OCR OUTPUT ==========\n")
    print(final_text)

    with open("output.txt", "w", encoding="utf-8") as f:
        f.write(final_text)
