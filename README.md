# Smart Loan Approval & Risk Analysis System (Loan Predictor)

An end-to-end Machine Learning web application designed to automate credit underwriting, analyze borrower default risk, and categorize applicants into risk tiers. 

This repository structures a **Flask REST API (Backend)** and a **React.js Dashboard (Frontend)** into clean, independent modules.

---

## 📂 Project Architecture

```text
├── backend/                  # Python Flask API & Machine Learning Artifacts
│   ├── app.py                # Flask REST API endpoints and preprocessing pipeline
│   ├── loan_data.csv         # Historical training dataset (614 entries)
│   ├── LoanApproval.ipynb    # Jupyter Notebook for EDA, model training & tuning
│   ├── loan_model.pkl        # Serialized trained XGBoost model
│   ├── scaler.pkl            # Serialized fitted StandardScaler
│   ├── encoder.pkl           # Serialized LabelEncoders & OneHotEncoder
│   └── requirements.txt      # Backend Python dependencies
│
└── frontend/                 # React.js + Vite Web Application
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx      # Dashboard landing screen with ML insights
    │   │   ├── LoanForm.jsx  # Interactive loan application inputs
    │   │   └── ResultPage.jsx# circular gauge score & risk analysis report
    │   ├── App.jsx           # Views router and application frame
    │   ├── index.css         # Styling system
    │   └── main.jsx
    ├── index.html            # Main HTML document
    └── package.json          # Frontend packages & script definitions
```

---

## 🛠️ Tech Stack

* **Machine Learning:** Python, Pandas, NumPy, Scikit-Learn, XGBoost, Joblib, Matplotlib, Seaborn
* **Backend API:** Flask, Flask-CORS, Gunicorn/Waitress
* **Frontend Web App:** React.js, Vite, Axios, Lucide Icons, Vanilla CSS (harmonious dark themes and glassmorphism)

---

## 🚀 Features & Custom Enhancements

### 1. Indian Rupees (₹) Integration & Scaling
- **Raw User Entry:** The form accepts actual, raw Rupee values (e.g., ₹45,000 monthly income and ₹12,00,000 loan amount) instead of forcing input in thousands or USD.
- **Backend Scaling:** The API automatically scales Rupee inputs to the model's training parameters in the background (divides income by `10` and loan amount by `10000` to represent thousands equivalent) keeping model predictions 100% accurate.
- **Indian Standard Currency Format:** Outputs display amounts utilizing standard Indian number formatting (e.g., `₹ 45,000` and `₹ 12,00,000`).

### 2. Underwriting Decision Parameters
- **Credit History Validation:** Checks credit status rules (standard guidelines). If credit history is missing or invalid, the applicant is flagged as high-risk.
- **Income-to-Debt Ratio Calculation:** Dynamically creates the `Income_to_Loan_Ratio` feature, dividing total monthly income by requested loan size.

### 3. Restructured Loan Term Length
- Modified selector parameters to display loan term length options starting from **1 Year (12 Months)** up to **20 Years (240 Months)** in yearly steps. Default parameters reset directly to a standard 20-year schedule.

### 4. Co-applicant Income Clean-Up
- Completely removed the secondary income entry fields from the user interface and output dashboard to streamline application procedures. The system default defaults it to `0` behind the scenes.

---

## 💻 Running Locally

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/vivek0u0705/smart-loan-approval-system.git
cd smart-loan-approval-system
```

### 2. Run Flask Backend Server
Navigate to the `/backend` folder, install requirements, and run the Python backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The backend API will start on `http://127.0.0.1:5000`.*

### 3. Run React Frontend
Navigate to the `/frontend` folder, install Node packages, and launch Vite development server:
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend dashboard will run on `http://localhost:5173`.*

---

## ☁️ Deployment Guide

### Backend (Render Deployment)
Deploy the root repository to Render:
1. Create a new **Web Service** on Render.
2. Select your repository.
3. Configure the following environment fields:
   - **Root Directory:** Keep blank or set to `backend`
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`

### Frontend (Vercel Deployment)
Deploy only the static user interface:
1. Create a new project in **Vercel** importing your repo.
2. Under **Root Directory** configuration, select the **`frontend`** directory.
3. Keep default build presets (Vite will build to `dist/`).
4. Click **Deploy**.
