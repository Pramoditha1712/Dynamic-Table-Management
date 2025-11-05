import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

function DataTable() {
  const initialData = [
    { name: "Alice", email: "alice@example.com", age: 25, role: "Developer", department: "IT", location: "Hyderabad" },
    { name: "Bob", email: "bob@example.com", age: 30, role: "Designer", department: "UI/UX", location: "Mumbai" },
    { name: "Charlie", email: "charlie@example.com", age: 28, role: "Tester", department: "QA", location: "Delhi" },
    { name: "David", email: "david@example.com", age: 32, role: "Manager", department: "Admin", location: "Pune" },
    { name: "Emma", email: "emma@example.com", age: 27, role: "Developer", department: "IT", location: "Bangalore" },
    { name: "Frank", email: "frank@example.com", age: 35, role: "Analyst", department: "Finance", location: "Chennai" },
    { name: "Grace", email: "grace@example.com", age: 29, role: "Designer", department: "UI/UX", location: "Kolkata" },
    { name: "Hannah", email: "hannah@example.com", age: 31, role: "Tester", department: "QA", location: "Delhi" },
    { name: "Ian", email: "ian@example.com", age: 26, role: "Developer", department: "IT", location: "Hyderabad" },
    { name: "Jack", email: "jack@example.com", age: 33, role: "Manager", department: "Admin", location: "Pune" },
    { name: "Kate", email: "kate@example.com", age: 24, role: "Intern", department: "HR", location: "Delhi" },
    { name: "Leo", email: "leo@example.com", age: 29, role: "Analyst", department: "Finance", location: "Chennai" },
    { name: "Mia", email: "mia@example.com", age: 34, role: "Lead", department: "IT", location: "Hyderabad" },
    { name: "Nick", email: "nick@example.com", age: 27, role: "Tester", department: "QA", location: "Bangalore" },
    { name: "Olivia", email: "olivia@example.com", age: 25, role: "Developer", department: "IT", location: "Pune" },
    { name: "Paul", email: "paul@example.com", age: 30, role: "Designer", department: "UI/UX", location: "Kolkata" },
    { name: "Quinn", email: "quinn@example.com", age: 31, role: "Manager", department: "Admin", location: "Delhi" },
    { name: "Rose", email: "rose@example.com", age: 28, role: "Analyst", department: "Finance", location: "Chennai" },
    { name: "Steve", email: "steve@example.com", age: 32, role: "Tester", department: "QA", location: "Bangalore" },
    { name: "Tina", email: "tina@example.com", age: 29, role: "Developer", department: "IT", location: "Hyderabad" },
    { name: "Uma", email: "uma@example.com", age: 33, role: "Manager", department: "Admin", location: "Pune" },
    { name: "Victor", email: "victor@example.com", age: 35, role: "Analyst", department: "Finance", location: "Kolkata" },
    { name: "Wendy", email: "wendy@example.com", age: 27, role: "Designer", department: "UI/UX", location: "Mumbai" },
    { name: "Xavier", email: "xavier@example.com", age: 26, role: "Developer", department: "IT", location: "Chennai" },
    { name: "Yara", email: "yara@example.com", age: 34, role: "Lead", department: "HR", location: "Delhi" },
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [visibleColumns, setVisibleColumns] = useState(
    JSON.parse(localStorage.getItem("visibleColumns")) || {
      name: true,
      email: true,
      age: true,
      role: true,
      department: true,
      location: true,
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const x = a[sortConfig.key];
    const y = b[sortConfig.key];
    if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
    if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key && prev.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (!result.data[0].name) alert("Invalid CSV Format");
        else setData(result.data);
      },
    });
  };

  const handleExport = () => {
    const visibleKeys = Object.keys(visibleColumns).filter((key) => visibleColumns[key]);
    const csvData = data.map((row) =>
      Object.fromEntries(visibleKeys.map((k) => [k, row[k]]))
    );
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "table_export.csv");
  };

  return (
    <div className={`container mt-4 ${theme === "dark" ? "text-light" : "text-dark"}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📊 Dynamic Data Table Manager</h2>
        <button
          className={`btn ${theme === "dark" ? "btn-light" : "btn-dark"}`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <input
        type="text"
        className="form-control my-3"
        placeholder="Search all fields..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-2">
        <button className="btn btn-outline-secondary me-2" onClick={() => setShowModal(true)}>
          Manage Columns
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="btn btn-outline-primary me-2"
        />
        <button className="btn btn-success" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <table className={`table table-striped mt-3 ${theme === "dark" ? "table-dark" : ""}`}>
        <thead>
          <tr>
            {Object.entries(visibleColumns).map(
              ([col, visible]) =>
                visible && (
                  <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                    {col.charAt(0).toUpperCase() + col.slice(1)} {getArrow(col)}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {Object.entries(visibleColumns).map(
                ([col, visible]) => visible && <td key={col}>{row[col]}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center gap-2">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: "#00000055" }}>
          <div className="modal-dialog">
            <div className={`modal-content p-3 ${theme === "dark" ? "bg-dark text-light" : ""}`}>
              <h5>Manage Columns</h5>
              {Object.keys(visibleColumns).map((col) => (
                <div key={col}>
                  <input
                    type="checkbox"
                    checked={visibleColumns[col]}
                    onChange={(e) =>
                      setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })
                    }
                  />{" "}
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </div>
              ))}
              <button className="btn btn-primary mt-3" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
