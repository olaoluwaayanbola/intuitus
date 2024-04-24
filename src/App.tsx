import { useState, ChangeEvent } from "react";
import "./style/main.scss";
import 'chart.js/auto';
import { visualTypes } from "./components/FileUpdate";
import { Bar, Pie, Line, Scatter } from "react-chartjs-2";
import * as XLSX from 'xlsx';

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
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const binaryString = event.target?.result as string;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheetName = workbook.SheetNames[0]; // Assuming first sheet
            const worksheet = workbook.Sheets[sheetName];
            const rows: Row[] = XLSX.utils.sheet_to_json<Row>(worksheet, { header: 1 });

            // Process the data (e.g., transpose if needed)
            const processedData = processExcelData(rows); // Replace with your logic

            setData(processedData); // Update data state with processed data
          };
          reader.readAsBinaryString(file);
        } catch (error) {
          console.error("Error reading the file", error);
        }
      } else {
        console.error("Invalid file format. Please upload an Excel file.");
      }
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

  interface Row {
    [key: string]: any; // Dynamic property names for header row
  }

  const processExcelData = (rows: any[]) => {
    // Implement your logic to process Excel data (e.g., transpose, handle headers)
    // This example assumes data rows and returns it as is
    return {
      labels: ["January", "February", "March", "April", "May", "June", "July"], // Replace with actual labels from your data
      datasets: rows.map((row: any) => ({
        label: "Data", // Replace with actual label
        data: Object.values(row), // Assuming data is in each row object
        backgroundColor: getBackgroundColor(rows.indexOf(row)), // Pass index for color variation
        borderColor: getBackgroundColor(rows.indexOf(row)),
        borderWidth: 1,
      })),
    };
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
        {visualTypes?.map(({ name, value }, key) => (
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