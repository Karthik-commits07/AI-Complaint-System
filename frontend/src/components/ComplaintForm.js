import React from "react";

function ComplaintForm({
  formData,
  handleChange,
  saveComplaint,
  exportToExcel,
  downloadPDF,
}) {
  return (
    <div className="card shadow-lg p-4 h-100">
      <h3 className="mb-4">📝 Complaint Form</h3>

      <form onSubmit={saveComplaint}>
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Enter Customer Name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter Product Name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Batch Number</label>
          <input
            type="text"
            className="form-control"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            placeholder="Enter Batch Number"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Complaint</label>
          <textarea
            className="form-control"
            rows="5"
            name="complaint"
            value={formData.complaint}
            onChange={handleChange}
            placeholder="Enter Complaint"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Complaint
        </button>

        <button
          type="button"
          className="btn btn-success ms-2"
          onClick={exportToExcel}
        >
          Download Excel
        </button>

        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;