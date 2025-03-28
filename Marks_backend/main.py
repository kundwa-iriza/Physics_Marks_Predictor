from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import uvicorn

# Load the trained model
model = joblib.load("dataset/student_performance_model.pkl")
print(model)

class StudentData(BaseModel):
    age: int
    address: str
    Pstatus: str
    guardian: str
    traveltime: int
    studytime: int
    failures: int
    paid: str
    activities: str
    internet: str
    romantic: str
    health: int
    absences: int
    G1: int
    G2: int

# Initialize FastAPI app
app = FastAPI()

# Enable cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Enable cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define the prediction endpoint
@app.post("/predict")
def predict(student_data: StudentData):
    try:
        # Convert input data to a DataFrame
        input_data = student_data.model_dump()
        input_df = pd.DataFrame([input_data])

        # Apply binary encoding for binary categorical features
        binary_features = ['address', 'Pstatus', 'paid', 'activities', 'internet', 'romantic']
        binary_mappings = {
            "yes": 1, "no": 0,
            "U": 1, "R": 0,
            "T": 1, "A": 0
        }
        input_df[binary_features] = input_df[binary_features].replace(binary_mappings)

        # Make a prediction
        prediction = model.predict(input_df)

        # Return the prediction
        return {"predicted_final_grade": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


uvicorn.run(app, port=8000, log_level="info")