from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from typing import Optional
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from docx import Document
from email import policy
from email.parser import BytesParser
import io

import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = FastAPI()

def extract_text_from_file(filename, file_bytes):

    filename = filename.lower()

    # TXT
    if filename.endswith(".txt"):
        return file_bytes.decode("utf-8", errors="ignore")

    # PDF
    elif filename.endswith(".pdf"):
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        return text

    # DOCX
    elif filename.endswith(".docx"):
        doc_file = io.BytesIO(file_bytes)
        document = Document(doc_file)

        text = ""

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

        return text

    # EML
    elif filename.endswith(".eml"):
        email_file = io.BytesIO(file_bytes)

        message = BytesParser(
            policy=policy.default
        ).parse(email_file)

        text = ""

        if message["subject"]:
            text += "Subject: " + message["subject"] + "\n"

        if message["from"]:
            text += "From: " + message["from"] + "\n"

        if message.is_multipart():

            for part in message.walk():

                if part.get_content_type() == "text/plain":
                    try:
                        text += part.get_content()
                    except:
                        pass

        else:
            try:
                text += message.get_content()
            except:
                pass

        return text

    else:
        raise ValueError(
            "Unsupported file format. Use PDF, DOCX, TXT or EML."
        )

DATABASE_URL = "postgresql://postgres:Karthik%401506@localhost:5432/complaint_db"
engine = create_engine(DATABASE_URL)
connection = engine.connect()

print("Database Connected Successfully!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Complaint(BaseModel):
    customer_name: str
    product_name: str
    batch_number: str
    complaint: str
    category: Optional[str] = None
    priority: Optional[str] = None

@app.get("/")
def home():
    return {
        "message": "AI Customer Complaint Management System Backend Running Successfully"
    }


# ---------------- CATEGORY DETECTION ----------------

def detect_category(complaint):
    complaint = complaint.lower()

    if "battery" in complaint:
        return "Battery Issue"

    elif "screen" in complaint or "display" in complaint:
        return "Display Issue"

    elif "sound" in complaint or "speaker" in complaint:
        return "Audio Issue"

    elif "charging" in complaint or "charger" in complaint:
        return "Charging Issue"

    elif "camera" in complaint:
        return "Camera Issue"

    elif "network" in complaint or "signal" in complaint:
        return "Network Issue"

    else:
        return "Other"


# ---------------- PRIORITY DETECTION ----------------

def detect_priority(complaint):
    complaint = complaint.lower()

    if "fire" in complaint or "explosion" in complaint or "smoke" in complaint:
        return "High"

    elif "battery" in complaint or "screen" in complaint or "charging" in complaint:
        return "Medium"

    else:
        return "Low"


@app.post("/complaint")
def save_complaint(data: Complaint):

    category = data.category if data.category else detect_category(data.complaint)
    priority = data.priority if data.priority else detect_priority(data.complaint)

    print("Category =", category)
    print("Priority =", priority)
    query = text("""
INSERT INTO customers
(customer_name, product_name, batch_number, complaint, status, category, priority)
VALUES
(:customer_name, :product_name, :batch_number, :complaint, :status, :category, :priority)
""")

    connection.execute(query, {
    "customer_name": data.customer_name,
    "product_name": data.product_name,
    "batch_number": data.batch_number,
    "complaint": data.complaint,
    "status": "Pending",
    "category": category,
    "priority": priority
})

    connection.commit()
    return {
        "status": "success",
        "message": "Complaint Saved Successfully",
        "data": "data"
    }


@app.get("/complaints")
def get_complaints():
    result = connection.execute(
        text("SELECT * FROM customers ORDER BY created_at DESC;")
    )

    complaints = []

    for row in result:
        complaints.append({
            "id": row.id,
            "customer_name": row.customer_name,
            "product_name": row.product_name,
            "batch_number": row.batch_number,
            "complaint": row.complaint,
            "status": row.status,
            "category": row.category,
            "priority": row.priority,
            "created_at": str(row.created_at)
        })

    return complaints


@app.put("/update-status/{complaint_id}")
def update_status(complaint_id: int):

    connection.execute(
        text("""
            UPDATE customers
            SET status='Resolved'
            WHERE id=:id
        """),
        {"id": complaint_id}
    )

    connection.commit()

    return {"message": "Status Updated Successfully"}


@app.delete("/delete-complaint/{id}")
def delete_complaint(id: int):

    connection.execute(
        text("DELETE FROM customers WHERE id=:id"),
        {"id": id}
    )

    connection.commit()

    return {"message": "Complaint Deleted Successfully"}

class AIComplaint(BaseModel):
    text: str


@app.post("/ai/analyze-complaint")
def analyze_complaint(data: AIComplaint):

    prompt = f"""
You are an AI customer complaint analysis assistant.

Analyze this complaint and extract:

Complaint:
{data.text}

Return ONLY valid JSON:

{{
    "customer_name": "",
    "product_name": "",
    "batch_number": "",
    "complaint": "",
    "category": "",
    "priority": ""
}}

Allowed categories:
Battery Issue
Display Issue
Audio Issue
Charging Issue
Camera Issue
Network Issue
Other

Allowed priorities:
High
Medium
Low

Rules:
- If information is missing, return "Unknown".
- High priority for fire, smoke, explosion, dangerous overheating or safety issues.
- Medium priority for important product problems.
- Low priority for minor problems.
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You extract structured information from customer complaints."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        result_text = response.choices[0].message.content

        result_text = result_text.replace("```json", "")
        result_text = result_text.replace("```", "")
        result_text = result_text.strip()

        result = json.loads(result_text)

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        print("AI Error:", str(e))

        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/ai/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        file_bytes = await file.read()

        # 10 MB limit
        if len(file_bytes) > 10 * 1024 * 1024:
            return {
                "status": "error",
                "message": "File size must be less than 10 MB."
            }

        # Extract text from file
        complaint_text = extract_text_from_file(
            file.filename,
            file_bytes
        )

        if not complaint_text.strip():
            return {
                "status": "error",
                "message": "Could not extract text from file."
            }

        # AI prompt
        prompt = f"""
You are an AI customer complaint analysis assistant.

Analyze the following complaint:

{complaint_text}

Return ONLY valid JSON:

{{
    "customer_name": "",
    "product_name": "",
    "batch_number": "",
    "complaint": "",
    "category": "",
    "priority": ""
}}

Allowed categories:
Battery Issue
Display Issue
Audio Issue
Charging Issue
Camera Issue
Network Issue
Other

Allowed priorities:
High
Medium
Low

Rules:
- If information is missing, return "Unknown".
- High priority for fire, smoke, explosion,
  dangerous overheating or safety issues.
- Medium priority for important product problems.
- Low priority for minor problems.
"""

        # Send to Groq
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You extract structured information from customer complaints."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        # Get AI response
        result_text = response.choices[0].message.content

        result_text = result_text.replace("```json", "")
        result_text = result_text.replace("```", "")
        result_text = result_text.strip()

        result = json.loads(result_text)

        # Save AI result to PostgreSQL
        with engine.begin() as conn:
            conn.execute(
                text("""
                    INSERT INTO customers
                    (
                        customer_name,
                        product_name,
                        batch_number,
                        complaint,
                        category,
                        priority,
                        status
                    )
                    VALUES
                    (
                        :customer_name,
                        :product_name,
                        :batch_number,
                        :complaint,
                        :category,
                        :priority,
                        'Pending'
                    )
                """),
                {
                    "customer_name": result["customer_name"],
                    "product_name": result["product_name"],
                    "batch_number": result["batch_number"],
                    "complaint": result["complaint"],
                    "category": result["category"],
                    "priority": result["priority"]
                }
            )

        return {
            "status": "success",
            "filename": file.filename,
            "data": result
        }

    except Exception as e:
        print("FILE AI ERROR:", str(e))

        return {
            "status": "error",
            "message": str(e)
        }
    
        # Extract text
        complaint_text = extract_text_from_file(
            file.filename,
            file_bytes
        )

        if not complaint_text.strip():
            return {
                "status": "error",
                "message": "Could not extract text from the file."
            }

        # Send extracted text to AI
        prompt = f"""
You are an AI customer complaint analysis assistant.

Analyze this complaint document:

{complaint_text}

Return ONLY valid JSON:

{{
    "customer_name": "",
    "product_name": "",
    "batch_number": "",
    "complaint": "",
    "category": "",
    "priority": ""
}}

Allowed categories:
Battery Issue
Display Issue
Audio Issue
Charging Issue
Camera Issue
Network Issue
Other

Allowed priorities:
High
Medium
Low

Rules:
- If information is missing, use "Unknown".
- High priority for fire, smoke, explosion,
  dangerous overheating or safety issues.
- Medium for important product problems.
- Low for minor/general complaints.
"""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You extract structured information from customer complaints."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        result_text = response.choices[0].message.content

        result_text = result_text.replace("```json", "")
        result_text = result_text.replace("```", "")
        result_text = result_text.strip()

        result = json.loads(result_text)

        # Save AI result directly to PostgreSQL
        with engine.begin() as conn:

            conn.execute(
                text("""
                    INSERT INTO customers
                    (
                        customer_name,
                        product_name,
                        batch_number,
                        complaint,
                        category,
                        priority,
                        status
                    )
                    VALUES
                    (
                        :customer_name,
                        :product_name,
                        :batch_number,
                        :complaint,
                        :category,
                        :priority,
                        'Pending'
                    )
                """),
                {
                    "customer_name": result["customer_name"],
                    "product_name": result["product_name"],
                    "batch_number": result["batch_number"],
                    "complaint": result["complaint"],
                    "category": result["category"],
                    "priority": result["priority"]
                }
            )

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:

        print("FILE AI ERROR:", str(e))

        return {
            "status": "error",
            "message": str(e)
        }