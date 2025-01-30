import os
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from io import BytesIO

# Initialize FastAPI app
app = FastAPI()

# Define class names for skin type classification
# class_names = [
#     'Light Diseases and Disorders of Pigmentation',
#     'Acne and Rosacea Photos',
#     'Poison Ivy Photos and other Contact Dermatitis',     
#     'Atopic Dermatitis Photos',
#     'Hair Loss Photos Alopecia and other Hair Diseases'
# ]
class_names = [
    'Light Diseases and Disorders of Pigmentation',
    'Acne and Rosacea Photos',
    'Poison Ivy Photos and other Contact Dermatitis',     ]

# Load the Keras model
def get_models():
    global model  # Ensure global scope
    try:
        model = load_model('./models/skin_type_classifier.h5')
        print("Skin type model loaded successfully.")
    except Exception as e:
        print(f"Failed to load model: {e}")
        raise HTTPException(status_code=500, detail="Error loading model.")

# Call function to load models at startup
get_models()

# Preprocess the uploaded image
def preprocess_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))  # Resize image
        img_tensor = image.img_to_array(img)  # Convert to numpy array
        img_tensor = np.expand_dims(img_tensor, axis=0)  # Add batch dimension
        img_tensor /= 255.0  # Normalize pixel values
        return img_tensor
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        raise HTTPException(status_code=400, detail="Error processing image.")

# Predict skin type from the image
def predict_skin_type(img_path):
    try:
        processed_image = preprocess_image(img_path)
        predictions = model.predict(processed_image)
        predicted_class = class_names[np.argmax(predictions[0])]
        print(f"Skin type prediction: {predicted_class}")
        return predicted_class
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Error predicting skin type.")

# API Endpoint to Upload Image & Get Prediction
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        print("Received an image file.")

        # Read uploaded image content
        content = await file.read()
        im = Image.open(BytesIO(content))

        # Save image temporarily
        filename = "uploaded_image.png"
        file_path = os.path.join('./static', filename)
        os.makedirs('./static', exist_ok=True)
        im.save(file_path)
        print(f"Image saved at: {file_path}")

        # Ensure model is loaded
        if not model:
            raise HTTPException(status_code=500, detail="Model not loaded properly.")

        # Make a prediction
        predicted_class = predict_skin_type(file_path)

        return {"filename": file.filename, "predicted_class": predicted_class}

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Error processing image.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


