import os
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File,Form
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL here (e.g., "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


DATA_FILE = "data.csv"

# Create the CSV file if it doesn't exist
if not os.path.exists(DATA_FILE):
    df = pd.DataFrame(columns=["name", "email", "password", "phone", "address"])
    df.to_csv(DATA_FILE, index=False)

class User(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    address: str


class LoginData(BaseModel):
    email: str
    password: str


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

def get_models():
    global model  
    try:
        model = load_model('./models/skin_type_classifier.h5')
        print("Skin type model loaded successfully.")
    except Exception as e:
        print(f"Failed to load model: {e}")
        raise HTTPException(status_code=500, detail="Error loading model.")

get_models()

def preprocess_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224)) 
        img_tensor = image.img_to_array(img)  
        img_tensor = np.expand_dims(img_tensor, axis=0)  
        img_tensor /= 255.0  # Normalize pixel values
        return img_tensor
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        raise HTTPException(status_code=400, detail="Error processing image.")


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


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        print("Received an image file.")


        content = await file.read()
        im = Image.open(BytesIO(content))


        filename = "uploaded_image.png"
        file_path = os.path.join('./static', filename)
        os.makedirs('./static', exist_ok=True)
        im.save(file_path)
        print(f"Image saved at: {file_path}")

      
        if not model:
            raise HTTPException(status_code=500, detail="Model not loaded properly.")

        predicted_class = predict_skin_type(file_path)

        return {"filename": file.filename, "predicted_class": predicted_class}

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Error processing image.")

@app.post("/register")
async def register(user: User):
    df = pd.read_csv(DATA_FILE)

    # Check if email already exists
    if user.email in df['email'].values:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Add new user to the CSV
    new_data = pd.DataFrame([user.dict()])
    new_data.to_csv(DATA_FILE, mode='a', header=False, index=False)
    return {"message": "Registration successful"}


@app.post("/login")
async def login(login_data: LoginData):
    email = login_data.email.strip().lower()
    password = login_data.password.strip().lower()
    print(f"Attempting login for: {email}, {password}")

    df = pd.read_csv(DATA_FILE)
    
    # Ensure the columns are of string type
    df['email'] = df['email'].astype(str)
    df['password'] = df['password'].astype(str)

    # Validate credentials
    user = df[(df['email'].str.strip().str.lower() == email) & (df['password'].str.strip().str.lower() == password)]
    
    if not user.empty:
        return {"message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
   



