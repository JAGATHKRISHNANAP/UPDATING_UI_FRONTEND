import React, { useState } from 'react';
import TreeHierarchy from '../charts/treeHierarchy'; 
import HierarchicalBarChart from '../charts/hierarchialBarChart';
import Pie from '../charts/Pie';
import LineChart from '../charts/lineChart';
import ScatterPlot from '../charts/scatterChart';
import BarChart from '../charts/barChart';
import AreaChart from '../charts/area';
import PolarAreaChart from '../charts/polarArea';

import DuelAxisChart from '../charts/duelAxesChart';
import TextChart from '../charts/textChart';
import MapChart from '../charts/mapchart';
import SingleValueChart from '../charts/singleValueChart';
import Treemap from '../charts/animatedTreeChart';
import AiChart from '../charts/aiChart';
  

import SampleAiTestChart from '../charts/sampleAiTestChart';
import { Paper, styled } from '@mui/material';
import WordCloud from '../charts/wordCloudChart';
const Items = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`, // Add border
  borderRadius: theme.shape.borderRadius, // Optional for rounded corners
}));
const ChartRenderer = ({ xAxis,yAxis, chartType, plotData, handleSaveButtonClick }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "pie") {
          return <Pie {...plotData} />;
        }
        break;
      case 'line':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "line") {
        return <LineChart {...plotData} />;
        }
        break;
      case 'scatter':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "scatter") {
        return <ScatterPlot {...plotData} />;
        }
        break ;
      case 'bar':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "bar") {
        return <BarChart {...plotData} />;
        }
        break;
      case 'area':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "area") {
        return <AreaChart {...plotData} />;
        }
        break;
      case 'polarArea':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "polarArea") {
        return <PolarAreaChart {...plotData} />;
      }
      break;
      case 'textChart':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "textChart") {
        return <TextChart {...plotData} />;
      }
      break;
      case 'singleValueChart':
        if (xAxis.length > 0 && chartType === "singleValueChart") {
        return <SingleValueChart {...plotData} />;
                }
        break;
      case 'mapchart':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "mapchart") {
        return <MapChart {...plotData} />;
                }
        break;
      case 'duealChart':
        if (xAxis.length > 0 && yAxis.length > 1 && chartType === "duealChart") {
        return (
          <DuelAxisChart
            categories={plotData?.categories}
            series1={plotData?.series1}
            series2={plotData?.series2}
            aggregation={plotData?.aggregation}
          />
        );
      }
      break;
      case 'treeHierarchy':
        if (chartType === "treeHierarchy") {
        return <TreeHierarchy />;
                }
        break;
      case 'sampleAitestChart':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "sampleAitestChart") {
        return <SampleAiTestChart />;
                }
        break;
      case 'AiCharts':
        if ( chartType === "AiCharts") {
        return <AiChart />;
                }
        break;
      case 'animatedTreeChart':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "animatedTreeChart") {
        return <Treemap {...plotData} />;
                }
        break;
      case 'hierarchialBarChart':
        if (xAxis.length > 0 && yAxis.length > 0 && chartType === "hierarchialBarChart") {
        return <HierarchicalBarChart {...plotData} />;
                }
        break;
      case 'wordCloud': 
        if (xAxis.length > 0 && chartType === "wordCloud") {
        return <WordCloud {...plotData} />;
                }
        break;    
      default:
        return null;
    }
  };

  return (
    xAxis.length > 0 && (
      <div style={{ marginTop: '20px' }}>
        <Items>
          <div className="chart-container">{renderChart()}</div>
        </Items>
        <div className="btn-container">
          <button className="save-button" onClick={handleSaveButtonClick}>
            Save Chart
          </button>
        </div>
      </div>
    )
  );
};

export default ChartRenderer;
