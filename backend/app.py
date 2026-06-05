from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes (to allow communication with React frontend)
CORS(app)

# Paths to the model artifacts
MODEL_PATH = 'loan_model.pkl'
SCALER_PATH = 'scaler.pkl'
ENCODER_PATH = 'encoder.pkl'

# Load artifacts at startup
print("Loading model artifacts...")
try:
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH) or not os.path.exists(ENCODER_PATH):
        raise FileNotFoundError("One or more model artifact pickle files (.pkl) are missing in the workspace directory.")
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    encoders = joblib.load(ENCODER_PATH)
    print("Model artifacts successfully loaded!")
except Exception as e:
    print(f"Error loading model artifacts: {str(e)}")
    model, scaler, encoders = None, None, None

@app.route('/', methods=['GET'])
def home():
    """Health check and summary endpoint."""
    if model and scaler and encoders:
        status = "Ready"
    else:
        status = "Error (Artifacts Missing)"
    
    return jsonify({
        'system': 'Smart Loan Approval & Risk Analysis System API',
        'status': status,
        'phase': 'Phase 2 (Flask Backend)',
        'endpoints': {
            'GET /': 'Health check',
            'POST /predict': 'Receive raw applicant values and return risk classification'
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Accepts raw loan application data in JSON format:
    {
        "Gender": "Male",
        "Married": "Yes",
        "Education": "Graduate",
        "Self_Employed": "No",
        "ApplicantIncome": 5000,
        "CoapplicantIncome": 1500,
        "LoanAmount": 120,
        "Loan_Amount_Term": 360,
        "Credit_History": 1.0,
        "Property_Area": "Urban"
    }
    Returns prediction status, approval probability, and risk level.
    """
    if not model or not scaler or not encoders:
        return jsonify({'error': 'Server configuration error: model files not loaded.'}), 500
        
    try:
        # Get raw JSON from post request body
        raw_input = request.get_json(force=True)
        if not raw_input:
            return jsonify({'error': 'No input data provided'}), 400
            
        # Convert dictionary to DataFrame
        # Convert values from Rupees (INR) to standard model scale (USD equivalent)
        # Income in INR is divided by 10 (e.g. 45000 INR -> 4500)
        # LoanAmount in INR is divided by 10000 (e.g. 1200000 INR -> 120.0)
        if 'ApplicantIncome' in raw_input:
            raw_input['ApplicantIncome'] = float(raw_input['ApplicantIncome']) / 10.0
        if 'CoapplicantIncome' in raw_input:
            raw_input['CoapplicantIncome'] = float(raw_input['CoapplicantIncome']) / 10.0
        if 'LoanAmount' in raw_input:
            raw_input['LoanAmount'] = float(raw_input['LoanAmount']) / 10000.0

        input_df = pd.DataFrame([raw_input])
        
        # Enforce column schema and set system default values for any missing keys
        defaults = {
            'Gender': 'Male',
            'Married': 'No',
            'Education': 'Graduate',
            'Self_Employed': 'No',
            'ApplicantIncome': 4000.0,
            'CoapplicantIncome': 0.0,
            'LoanAmount': 120.0,
            'Loan_Amount_Term': 360.0,
            'Credit_History': 1.0,
            'Property_Area': 'Semiurban'
        }
        
        for col in defaults:
            if col not in input_df.columns:
                input_df[col] = defaults[col]
        
        # Perform Categorical Encoding using the saved LabelEncoder objects
        binary_cols = ['Gender', 'Married', 'Education', 'Self_Employed']
        for col in binary_cols:
            le = encoders[col]
            val = str(input_df[col].values[0]).strip()
            # Handle out-of-vocabulary or unknown classes gracefully
            if val not in le.classes_:
                val = str(defaults[col])
            input_df[col] = le.transform([val])[0]
            
        # Perform One-Hot Encoding for Property_Area using saved OneHotEncoder
        ohe = encoders['Property_Area']
        ohe_cols = encoders['ohe_cols']
        prop_area_val = str(input_df['Property_Area'].values[0]).strip()
        if prop_area_val not in ohe.categories_[0]:
            prop_area_val = str(defaults['Property_Area'])
            
        ohe_features = ohe.transform([[prop_area_val]])
        ohe_df = pd.DataFrame(ohe_features, columns=ohe_cols, index=input_df.index)
        
        # Join one-hot columns and drop original column
        input_df = pd.concat([input_df.drop(columns=['Property_Area']), ohe_df], axis=1)
        
        # Perform Feature Engineering (matching training pipeline)
        input_df['Total_Income'] = input_df['ApplicantIncome'] + input_df['CoapplicantIncome']
        
        # Avoid zero division error if LoanAmount is zero
        loan_amt = input_df['LoanAmount'].values[0]
        if loan_amt == 0:
            input_df['Income_to_Loan_Ratio'] = 0.0
        else:
            input_df['Income_to_Loan_Ratio'] = input_df['Total_Income'] / loan_amt
            
        # Scale numeric features using the fitted StandardScaler
        num_cols = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Total_Income', 'Income_to_Loan_Ratio']
        input_df[num_cols] = scaler.transform(input_df[num_cols])
        
        # Enforce the exact same feature sequence used during training
        feature_cols = [
            'Gender', 'Married', 'Education', 'Self_Employed', 
            'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 
            'Credit_History', 'Total_Income', 'Income_to_Loan_Ratio',
            'Property_Area_Rural', 'Property_Area_Semiurban', 'Property_Area_Urban'
        ]
        input_df = input_df[feature_cols]
        
        # Run model predictions
        pred = model.predict(input_df)[0]
        prob = model.predict_proba(input_df)[0][1] # Probability of Class 1 (Y - Approved)
        
        # Risk classification
        prob_percentage = prob * 100
        if prob_percentage < 30:
            risk_level = 'High Risk'
        elif prob_percentage <= 70:
            risk_level = 'Medium Risk'
        else:
            risk_level = 'Low Risk'
            
        prediction_label = 'Approved' if pred == 1 else 'Rejected'
        
        # Return response
        return jsonify({
            'prediction': prediction_label,
            'probability': round(float(prob_percentage), 2),
            'risk_level': risk_level
        })
        
    except Exception as e:
        return jsonify({
            'error': 'An error occurred during prediction.',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    # Run the server locally on port 5000
    app.run(host='127.0.0.1', port=5000, debug=True)
