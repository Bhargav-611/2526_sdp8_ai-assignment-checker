import cv2
import numpy as np

def preprocess_image(image_path):
    """Complete preprocessing pipeline"""
    # Load image
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply CLAHE for contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    contrast = clahe.apply(gray)
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(contrast, h=30)
    
    # Threshold
    thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    
    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    
    # Invert if needed (text should be black on white)
    if np.mean(morph) > 127:
        morph = cv2.bitwise_not(morph)
    
    return morph

# Main execution
if __name__ == "__main__":
    image_path = 'test.png'
    
    # Preprocess
    processed = preprocess_image(image_path)
    
    # Save processed image
    cv2.imwrite('processed_image.jpg', processed)
    print("Preprocessing complete. Saved as processed_image.jpg")
    
    # Display
    cv2.imshow('Processed', processed)
    cv2.waitKey(0)
    cv2.destroyAllWindows()