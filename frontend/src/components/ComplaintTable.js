import React from "react";

function ComplaintTable({
  complaints,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  updateStatus,
  deleteComplaint,
}) {
  return (
    <div className="card shadow-lg p-4 mt-4">

      <h3 className="mb-4">📋 Complaint List</h3>

      <div className="row mb-3">

        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search Customer or Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Battery Issue">Battery Issue</option>
            <option value="Display Issue">Display Issue</option>
            <option value="Audio Issue">Audio Issue</option>
            <option value="Charging Issue">Charging Issue</option>
            <option value="Camera Issue">Camera Issue</option>
            <option value="Other Issue">Other Issue</option>
          </select>
        </div>

      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Batch</th>
              <th>Complaint</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints
              .filter((item) => {
                const searchMatch =
                  item.customer_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  item.product_name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                const categoryMatch =
                  categoryFilter === "All" ||
                  item.category === categoryFilter;

                return searchMatch && categoryMatch;
              })
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.product_name}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.complaint}</td>
                  <td>{item.category}</td>

                  <td
                    style={{
                      color:
                        item.priority === "High"
                          ? "red"
                          : item.priority === "Medium"
                          ? "orange"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {item.priority}
                  </td>

                  <td>{item.status}</td>

                  <td>{item.created_at}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => updateStatus(item.id)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => deleteComplaint(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ComplaintTable;