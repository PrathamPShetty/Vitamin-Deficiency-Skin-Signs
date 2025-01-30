import os
import uuid
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from io import BytesIO

# Initialize FastAPI app
app = FastAPI()

# Skin type and acne type class names
class_names1 = ['Dry_skin', 'Normal_skin', 'Oil_skin']


# Load the Keras models
def get_models():
    global model1, model2
    try:
        model1 = load_model('./models/best_model.pth')
        print("Skin type model loaded successfully.")
  
    except Exception as e:
        print(f"Failed to load models: {e}")
        raise HTTPException(status_code=500, detail="Error loading models.")

get_models()

# Preprocess the image for prediction
def preprocess_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_tensor = image.img_to_array(img)
        img_tensor = np.expand_dims(img_tensor, axis=0)
        img_tensor /= 255.0
        print(f"Image loaded and preprocessed from path: {img_path}")
        return img_tensor
    except Exception as e:
        print(f"Error in loading and preprocessing image: {e}")
        raise HTTPException(status_code=400, detail="Error processing image.")

def predict_skin(img_path):
    try:
        new_image = preprocess_image(img_path)
        predictions = model1.predict(new_image)
        pred_class = class_names1[np.argmax(predictions[0])]
        print(f"Skin type prediction: {pred_class}")
        return pred_class
    except Exception as e:
        print(f"Skin type prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Error predicting skin type.")



@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        print("Image file received in the POST request")

        # Read and save the uploaded image
        content = await file.read()
        im = Image.open(BytesIO(content))
        filename = f"image.png"
        file_path = os.path.join('./static', filename)
        os.makedirs('./static', exist_ok=True)
        im.save(file_path)
        print(f"Image saved at: {file_path}")

        # Ensure models are loaded
        if not model1 or not model2:
            raise HTTPException(status_code=500, detail="Models are not loaded properly.")

        # Make predictions
        skin_type = predict_skin(file_path).split('_')[0]
        acne_type = predict_acne(file_path).split('_')[0]
 

        print(f"Prediction response: Skin type: {skin_type}, Acne type: {acne_type}")

     

        return {"skin_type": skin_type,  "acne_type": acne_type}

    except Exception as e:
        print(f"Error processing the request: {e}")
        raise HTTPException(status_code=500, detail="Error processing the image.")
