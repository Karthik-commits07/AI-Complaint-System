# AI Complaint System

An AI-powered complaint management system that helps organizations
collect, analyze, classify, and manage customer complaints using
artificial intelligence.

## 🚀 Project Overview

The AI Complaint System combines a modern React frontend, FastAPI
backend, PostgreSQL database, and AI-powered complaint analysis to make
complaint handling faster and more structured.

The system allows users to submit complaints manually or provide
complaint-related documents/text for AI analysis. The AI assistant
extracts important information, classifies complaints, determines
priority, summarizes the issue, and provides risk/root-cause insights.

## ✨ Key Features

-   📝 Manual complaint submission
-   🤖 AI-powered complaint analysis
-   📄 Support for complaint text and document-based input
-   🔍 Automatic extraction of complaint details
-   🏷️ Complaint category classification
-   🚨 Priority and risk assessment
-   📊 Dashboard with complaint statistics and charts
-   📋 Complaint table for viewing and managing complaints
-   🔄 Complaint status updates
-   🧠 AI-generated summaries and insights
-   🗄️ PostgreSQL database integration
-   🔐 Environment-variable based API key configuration

## 🛠️ Technology Stack

### Frontend

-   React.js
-   JavaScript
-   CSS
-   Chart components for dashboard visualization

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   REST API

### Database

-   PostgreSQL

### AI

-   Groq API
-   LangGraph

## 📁 Project Structure

``` text
AI_Complaint_System/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistant.js
│   │   │   ├── Charts.js
│   │   │   ├── ComplaintForm.js
│   │   │   ├── ComplaintTable.js
│   │   │   └── Dashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── .gitignore
```

## 🔄 System Workflow

1.  User submits a complaint or complaint-related content.
2.  The frontend sends the data to the FastAPI backend.
3.  The backend processes and stores complaint information in
    PostgreSQL.
4.  AI services analyze the complaint.
5.  The system identifies relevant details such as customer, product,
    complaint category, priority, and risk.
6.  AI-generated analysis and recommendations are displayed in the
    application.
7.  The dashboard and complaint table provide an organized view of the
    stored complaints.

## ⚙️ Setup

### 1. Clone the repository

``` bash
git clone https://github.com/Karthik-commits07/AI-Complaint-System.git
cd AI-Complaint-System
```

### 2. Backend setup

Create and activate a Python virtual environment:

``` bash
python -m venv venv
```

Windows:

``` bash
venv\Scripts\activate
```

Install backend dependencies:

``` bash
pip install -r backend/requirements.txt
```

### 3. Environment variables

Create a `.env` file in the appropriate backend/project location and
configure the required credentials, including the Groq API key and
PostgreSQL database connection details.

Example:

``` env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgresql_connection_string
```

> Never commit the `.env` file or API keys to GitHub.

### 4. Start the backend

``` bash
cd backend
uvicorn main:app --reload
```

### 5. Start the frontend

Open another terminal:

``` bash
cd frontend
npm install
npm start
```

The frontend and backend can then communicate through the configured API
endpoints.

## 📊 Dashboard

The dashboard provides a visual overview of complaint information,
including complaint statistics, categories, priorities, and other useful
insights.

## 🔒 Security

Sensitive credentials are stored using environment variables and
excluded from version control through `.gitignore`.

Do not expose: - Groq API keys - PostgreSQL passwords - Database
connection strings - Other private credentials

## 🎯 Project Objectives

-   Automate complaint analysis
-   Reduce manual complaint classification
-   Improve complaint prioritization
-   Provide faster access to complaint insights
-   Maintain structured complaint records
-   Support data-driven complaint management

## 👨‍💻 Author

**Karthik-commits07**

## 📄 License

This project is licensed under the MIT License.
