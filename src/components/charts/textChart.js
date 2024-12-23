import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import "./TextChart.css"; // Import your CSS file
import { sendChartData } from "../../utils/api";
// import { useSelector } from "react-redux";

const TextChart = (props) => {
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const x_axis = useSelector((state) => state.chart.xAxis);
  const databaseName = useSelector((state) => state.database.databaseName);
  const table_Name = useSelector((state) => state.loadExcel.checkedPaths);
  console.log("excelCheckedPaths from textchart:", table_Name);
  console.log("databaseName from textchart:", databaseName);
  console.log("x_axis from textchart:", x_axis);

  const MAX_WIDTH = 1200; // Set your maximum width
  const MAX_HEIGHT = 600; // Set your maximum height

  useEffect(() => {
    console.log("Received categories:", props.categories);
    console.log("Received values:", props.values);
  }, [props.categories, props.values]);

  useEffect(() => {
    // Pass the data to the backend when the component mounts
    const sendDataToBackend = async () => {
      try {
        const response = await sendChartData(x_axis, databaseName, table_Name);
        console.log("Response from backend:", response);
      } catch (error) {
        console.error("Error sending data to backend", error);
      }
    };

    sendDataToBackend();
  }, [x_axis, databaseName, table_Name]);


  const { categories, values, aggregation } = props;
  const yAxisArray = useSelector((state) => state.chart.yAxis);

  console.log("yAxisArray:", yAxisArray);

  const yAxis = Array.isArray(yAxisArray) && yAxisArray.length > 0 ? yAxisArray[0] : "";
  const cleanYAxis = yAxis.replace(/[^a-zA-Z0-9 ]/g, "");

  console.log("cleanYAxis:", cleanYAxis);

  let aggregationLabel = "";
  switch (aggregation) {
    case "sum":
      aggregationLabel = "Sum";
      break;
    case "minimum":
      aggregationLabel = "Minimum";
      break;
    case "maximum":
      aggregationLabel = "Maximum";
      break;
    case "average":
      aggregationLabel = "Average";
      break;
    case "count":
      aggregationLabel = "Count";
      break;
    default:
      aggregationLabel = "";
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setDimensions((prevDimensions) => {
      const newWidth = Math.min(prevDimensions.width + deltaX, MAX_WIDTH);
      const newHeight = Math.min(prevDimensions.height + deltaY, MAX_HEIGHT);

      return {
        width: newWidth,
        height: newHeight,
      };
    });

    setStartX(e.clientX);
    setStartY(e.clientY);
  }, [isResizing, startX, startY]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <div className="app">
      <div className="row">
        <div
          className="border-box"
          onMouseDown={handleMouseDown}
          style={{ width: dimensions.width, height: dimensions.height, overflow: 'auto' }}
        >
          {Array.isArray(categories) && Array.isArray(values) && categories.length === values.length ? (
            categories.map((category, index) => (
              <div key={index}><pre className="left-align">
                <pre className="display">
                <strong className="catagory">{category}: </strong><p className="value">{values[index]}{" "}</p>{aggregationLabel} of {cleanYAxis}</pre>
                </pre>
              </div>
            ))
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextChart;

