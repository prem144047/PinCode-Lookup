import React, { useState } from "react";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Fetch API
  const handleLookup = async () => {
    setError("");
    setData([]);
    setFilteredData([]);

    // ❌ Validate Pincode
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await res.json();

      if (result[0].Status === "Error") {
        setError("Invalid Pincode or no data found");
      } else {
        setData(result[0].PostOffice);
        setFilteredData(result[0].PostOffice);
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }

    setLoading(false);
  };

  // 🔎 Filter Logic
  const handleFilter = (value) => {
    setFilter(value);

    const filtered = data.filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>

      {/* Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={handleLookup}>Lookup</button>
      </div>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Loader */}
      {loading && <div className="loader"></div>}

      {/* Data */}
      {filteredData.length > 0 && (
        <>
          {/* Filter */}
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            value={filter}
            onChange={(e) => handleFilter(e.target.value)}
            className="filter"
          />

          {/* Results */}
          <div className="results">
            {filteredData.map((item, index) => (
              <div key={index} className="card">
                <p><strong>Name:</strong> {item.Name}</p>
                <p><strong>Pincode:</strong> {pincode}</p>
                <p><strong>District:</strong> {item.District}</p>
                <p><strong>State:</strong> {item.State}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Filter Result */}
      {data.length > 0 && filteredData.length === 0 && (
        <p>Couldn’t find the postal data you’re looking for…</p>
      )}
    </div>
  );
}

export default App;