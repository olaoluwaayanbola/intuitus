import React, { useState } from "react";
import "./style/main.scss";
import { visualTypes } from "./components/FileUpdate";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [chartType, setChartType] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <div className="main_container">
      <h1>Data Visualization App</h1>
      <header className="header-container">
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
        />
      </header>
      <nav className="nav-container">
        {visualTypes.map(({ name, value }, key) => (
          <div
            key={key}
            className={`visualTypes ${chartType === value && "active"}`}
            onClick={() => handleChartTypeChange(value)}
          >
            <h3>{name}</h3>
          </div>
        ))}
      </nav>
      <main className="main-container">
        {chartType && <div className="chart">{chartType}</div>}
      </main>
      <footer className="footer-container"></footer>
    </div>
  );
}

export default App;
