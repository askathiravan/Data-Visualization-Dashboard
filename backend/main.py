from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from services.data_processor import DataProcessor

app = FastAPI(title="Data Viz API", version="1.0.0")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SETUP ----------------
data_processor = DataProcessor()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

CURRENT_FILE = UPLOAD_DIR / "current_data.csv"

# ---------------- HEALTH CHECK ----------------
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Backend running successfully"
    }

# ---------------- CSV UPLOAD ----------------
@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB")

    # Save uploaded file
    with open(CURRENT_FILE, "wb") as f:
        f.write(contents)

    try:
        result = data_processor.analyze_csv(str(CURRENT_FILE))
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to process CSV file")

# ---------------- CHART DATA ----------------
@app.get("/api/chart-data")
async def get_chart_data(x: str, y: str):
    if not CURRENT_FILE.exists():
        raise HTTPException(status_code=400, detail="No CSV uploaded yet")

    try:
        data = data_processor.get_chart_data(
            str(CURRENT_FILE),
            x,
            y
        )
        return data

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate chart data")
