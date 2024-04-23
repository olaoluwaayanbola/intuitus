import React, { useState, ChangeEvent } from "react";
import "./style/main.scss";
import { visualTypes } from "./components/FileUpdate";
import { Bar, Pie, Line, Scatter} from "react-chartjs-2";
import readXlsxFile from "read-excel-file";

interface File {
  name: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartType, setChartType] = useState<string | null>(null);
  const [data, setData] = useState<any>({});

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setSelectedFile(file);
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension === "xlsx" || extension === "xls") {
        await readExcelFile(file);
      } else {
        console.error("Invalid file format. Please upload an Excel file.");
      }
    }
  };

  const readExcelFile = async (file: File) => {
    try {
      const rows = await readXlsxFile(file);
      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Transposing the data
      const transposedData = headers.map((header: any, index: number) => {
        return dataRows.map((row: any) => row[index]);
      });

      // Creating datasets
      const datasets = transposedData.map((column: any, index: number) => {
        const backgroundColor = getBackgroundColor(index);
        return {
          label: headers[index],
          data: column.slice(0, 7), // Only first 7 elements
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
        };
      });

      setData({
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets,
      });
    } catch (error) {
      console.error("Error reading the file", error);
    }
  };

  const getBackgroundColor = (index: number) => {
    const colors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 99, 132, 0.2)",
    ];
    return colors[index % colors.length];
  };

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} />;
      case "pie":
        return <Pie data={data} />;
      case "line":
        return <Line data={data} />;
      case "scatter":
        return <Scatter data={data} />;
      case "area":
        return <Area data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="main_container">
      <h1>Data Visualization App</h1>
      <header className="header-container">
        <label htmlFor="fileInput" className="file-upload-label">
          Upload File
        </label>
        <span className="file-name">
          {selectedFile && selectedFile.name}
        </span>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
      </header>
      <nav className="nav-container">
        {visualTypes.map(({ name, value }, key) => (
          <div
            key={key}
            className={`visualTypes ${chartType === value && "active"}`}
            onClick={() => {
              setChartType(value);
            }}
          >
            <h3>{name}</h3>
          </div>
        ))}
      </nav>
      <main className="main-container">{renderChart()}</main>
      <footer className="footer-container">
        &copy; {new Date().getFullYear()} Data Visualization App
      </footer>
    </div>
  );
}

export default App;
