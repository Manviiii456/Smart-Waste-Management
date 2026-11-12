
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime, timezone
from bson import ObjectId


# -------------------------------
# DATABASE CONNECTION
# -------------------------------

MONGO_URI = "mongodb://localhost:27017"

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=2000
    )

    client.admin.command("ping")

    db = client["smart_waste_management"]
    complaints_collection = db["complaints"]

    print("MongoDB Connected Successfully!")

except Exception as e:
    client = None
    complaints_collection = None
    print("MongoDB connection failed:", e)


# -------------------------------
# FASTAPI APPLICATION
# -------------------------------

app = FastAPI(
    title="Smart Waste Management System",
    description="API for managing waste complaints and collection",
    version="1.0"
)


# -------------------------------
# CORS CONFIGURATION
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# COMPLAINT MODEL
# -------------------------------

class Complaint(BaseModel):
    name: str
    category: str
    location: str
    description: str


# -------------------------------
# HOME ROUTE
# -------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to Smart Waste Management System",
        "status": "Backend is running"
    }


# -------------------------------
# HEALTH CHECK
# -------------------------------

@app.get("/health")
def health():
    return {
        "backend": "running",
        "database": (
            "connected"
            if complaints_collection is not None
            else "disconnected"
        )
    }


# -------------------------------
# REGISTER A COMPLAINT
# -------------------------------

@app.post("/complaints")
def register_complaint(complaint: Complaint):

    if complaints_collection is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected"
        )

    complaint_data = complaint.model_dump()

    complaint_data["status"] = "Pending"
    complaint_data["created_at"] = datetime.now(timezone.utc)

    result = complaints_collection.insert_one(complaint_data)

    return {
        "message": "Complaint registered successfully!",
        "complaint_id": str(result.inserted_id),
        "status": "Pending"
    }


# -------------------------------
# VIEW ALL COMPLAINTS
# -------------------------------

@app.get("/complaints")
def get_complaints():

    if complaints_collection is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected"
        )

    complaints = list(
        complaints_collection.find().sort("created_at", -1)
    )

    for complaint in complaints:
        complaint["_id"] = str(complaint["_id"])
        complaint["created_at"] = complaint["created_at"].isoformat()

    return complaints


# -------------------------------
# VIEW A SINGLE COMPLAINT
# -------------------------------

@app.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: str):

    if complaints_collection is None:
        raise HTTPException(
            status_code=503,
            detail="MongoDB is not connected"
        )

    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint ID"
        )

    complaint = complaints_collection.find_one(
        {"_id": ObjectId(complaint_id)}
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint["_id"] = str(complaint["_id"])
    complaint["created_at"] = complaint["created_at"].isoformat()

    return complaint
