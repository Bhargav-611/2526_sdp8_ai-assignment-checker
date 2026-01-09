import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
from utils import split_bw_image_into_valid_lines
from utils import convert_image_to_black_and_white

device = "cuda" if torch.cuda.is_available() else "cpu"

processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-large-handwritten"
)
model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-large-handwritten"
).to(device)

def trocr_multiline(
    img, processor, model, device,
    min_height=12,
    min_black_ratio=0.01
):
    lines = split_bw_image_into_valid_lines(
        img,
        min_height=min_height,
        min_black_ratio=min_black_ratio
    )

    full_text = []

    for line_img in lines:
        # Ensure PIL Image
        if not isinstance(line_img, Image.Image):
            line_img = Image.fromarray(line_img)


        # Convert to RGB mode as the processor expects 3 dimensions
        line_img_rgb = line_img.convert("RGB")

        pixel_values = processor(
            images=line_img_rgb,
            return_tensors="pt"
        ).pixel_values.to(device)

        generated_ids = model.generate(pixel_values)

        text = processor.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )[0]

        full_text.append(text)

    return " ".join(full_text)


def image_to_text_extraction(image_path):
    
    image  = Image.open(image_path).convert("RGB")

    img = convert_image_to_black_and_white(image)

    output_text = trocr_multiline(img , processor, model, device)

    return output_text
