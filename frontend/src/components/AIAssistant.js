import React, { useState } from "react";

function AIAssistant({ onComplaintSaved }) {
  const [complaintText, setComplaintText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeTextComplaint = async () => {
    if (!complaintText.trim()) {
      alert("Please paste a complaint first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/analyze-complaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: complaintText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "AI analysis failed");
      }

      const extracted = data.data;

      // Save AI result to PostgreSQL
      const saveResponse = await fetch(
        "http://127.0.0.1:8000/complaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: extracted.customer_name,
            product_name: extracted.product_name,
            batch_number: extracted.batch_number,
            complaint: extracted.complaint,
            category: extracted.category,
            priority: extracted.priority,
          }),
        }
      );

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.message || "Failed to save complaint");
      }

      setResult(extracted);

      if (onComplaintSaved) {
        onComplaintSaved();
      }

      alert("✅ AI analyzed and complaint saved successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) {
      alert("Please select a complaint file first.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/ai/analyze-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "File analysis failed");
      }

      setResult(data.data);

      if (onComplaintSaved) {
        onComplaintSaved();
      }

      alert("✅ File analyzed and complaint saved successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 h-100">
      <h3 className="mb-4">🤖 AI Complaint Intake Assistant</h3>

      {/* FILE UPLOAD */}

      <div className="mb-3">
        <label className="form-label">Upload Complaint File</label>

        <input
          type="file"
          className="form-control"
          accept=".pdf,.docx,.txt,.eml"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <small className="text-muted">
          Supported: PDF, DOCX, TXT, EML | Max 10 MB
        </small>
      </div>

      <button
        type="button"
        className="btn btn-success mb-4"
        onClick={analyzeFile}
        disabled={loading}
      >
        {loading ? "🤖 Processing..." : "📄 Analyze Uploaded File"}
      </button>

      <hr />

      {/* PASTE COMPLAINT */}

      <div className="mb-3">
        <label className="form-label">Paste Complaint</label>

        <textarea
          className="form-control"
          rows="6"
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          placeholder="Paste complaint email or text here..."
        />
      </div>

      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={analyzeTextComplaint}
        disabled={loading}
      >
        {loading ? "🤖 AI Analyzing..." : "🤖 Analyze & Save Complaint"}
      </button>

      {/* PROGRESS */}

      <label className="form-label">Extraction Progress</label>

      <div className="progress mb-3">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          style={{
            width: loading ? "70%" : result ? "100%" : "10%",
          }}
        >
          {loading ? "70%" : result ? "100%" : "10%"}
        </div>
      </div>

      {/* RESULT */}

      {result && (
        <div className="card border-success p-3 mt-3">
          <h5 className="text-success mb-3">
            ✅ AI Extraction Result
          </h5>

          <p>
            <strong>Customer:</strong> {result.customer_name}
          </p>

          <p>
            <strong>Product:</strong> {result.product_name}
          </p>

          <p>
            <strong>Batch:</strong> {result.batch_number}
          </p>

          <p>
            <strong>Complaint:</strong> {result.complaint}
          </p>

          <p>
            <strong>Category:</strong> {result.category}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            <span
              style={{
                color:
                  result.priority === "High"
                    ? "red"
                    : result.priority === "Medium"
                    ? "orange"
                    : "green",
                fontWeight: "bold",
              }}
            >
              {result.priority}
            </span>
          </p>
        </div>
      )}

      <div className="alert alert-primary mt-3 mb-0">
        🤖 AI automatically extracts customer name, product,
        complaint, category and priority.
      </div>
    </div>
  );
}

export default AIAssistant;