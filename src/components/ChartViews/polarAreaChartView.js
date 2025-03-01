

// import React, { useEffect, useState, useRef } from "react";
// import Chart from "react-apexcharts";
// import { useDispatch, useSelector } from "react-redux";
// import { ResizableBox } from 'react-resizable';
// import 'react-resizable/css/styles.css'; // Import the CSS for the resizable box
// import {updateSelectedCategory,updateChartData,setChartStatus} from '../../features/ViewChartSlice/viewChartSlice';
// import "../charts/tooltip.css"; // Import the CSS for the tooltip
// import { sendClickedCategory } from "../../utils/api";
// import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';

// const Pie = ({width = 300, height = 300,...props}) => {
//   const { categories, values: stringValues, aggregation ,x_axis} = props;
//   const values = stringValues.map(value => parseFloat(value));
//   const dispatch = useDispatch();
//   const [showResetButton, setShowResetButton] = useState(false);
//   const customHeadings = useSelector((state) => state.toolTip.customHeading); // Added customHeadings selector
//   const charts = useSelector((state) => state.viewcharts.charts);
//   const [isFilterActive, setIsFilterActive] = useState(false); // State to manage the filter functionality
//   const handleClicked = async (event, chartContext, config) => {
//     // if (!isFilterActive) return;
//     const clickedCategoryIndex = config.dataPointIndex;
//     const clickedCategory = categories[clickedCategoryIndex];
//     try {
//       // Trigger the API call to send the clicked category
//       const response = await sendClickedCategory(clickedCategory,charts,x_axis);
//       console.log("chart_data_list:", response.chart_data_list)
//       response.chart_data_list.forEach((chartData) => {
//           const { chart_id, data } = chartData;
//           dispatch(updateChartData({
//             chart_id,
//             categories: data.categories,
//             values: data.values,
//             series1:data.series1,
//             series2:data.series2,
//           }));
//         });
//   } catch (error) {
//       console.error(`Failed to send category ${clickedCategory}:`, error);
//   }

//     dispatch(updateSelectedCategory(clickedCategory));
   
//   };
 
  

//   const handleReset = () => {
//     // Reset the selected category and hide the reset button
//     dispatch(updateSelectedCategory(null));
//     dispatch(setChartStatus(false));
//     setShowResetButton(false);
// };

//   const handleFilterToggle = () => {
//     setIsFilterActive(prevState => !prevState); // Toggle the filter state
// };


// const options = {
//   chart: {
//       events: {
//         dataPointSelection: handleClicked
//       },
//       id: "basic-pie"
//     },
//     labels: categories || [],
//   fill: {
//       opacity: 1
//   },
//   stroke: {
//       width: 1,
//       // colors: ['#fff']
//   },
//   yaxis: {
//       show: false,
//       labels: {
//           formatter: function (value) {
//               return parseFloat(value).toFixed(2);
//           },
//       }
//   },
//   plotOptions: {
//       polarArea: {
//           rings: {
//               strokeWidth: 0
//           },
//           spokes: {
//               strokeWidth: 0
//           },
//       }
//   },
//   dataLabels: {
//       enabled: false,
//       formatter: function (val, opts) {
//           return val;
//       },
//       offsetY: -2,
//       style: {
//           fontSize: '12px',
//           // colors: ["#304758"]
//       }
//   },
//   grid: {
//       // borderColor: '#f1f3fa'
//   }
// };

// const series = values || [];

//   // const options = {
//   //   chart: {
//   //     events: {
//   //       dataPointSelection: handleClicked
//   //     },
//   //     id: "basic-pie"
//   //   },
//   //   labels: categories || [],
//   // };

//   // let aggregationLabel = '';
//   // switch (aggregation) {
//   //   case 'sum':
//   //     aggregationLabel = 'Sum';
//   //     break;
//   //   case 'minimum':
//   //     aggregationLabel = 'Minimum';
//   //     break;
//   //   case 'maximum':
//   //     aggregationLabel = 'Maximum';
//   //     break;
//   //   case 'average':
//   //     aggregationLabel = 'Average';
//   //     break;
//   //   case 'count':
//   //     aggregationLabel = 'Count';
//   //     break;
//   //   default:
//   //     aggregationLabel = '';
//   // }
//   // console.log("aggregration", aggregationLabel);

//   // const series = values || [];

//   return (
//     <div className="app">
//       <div className="row">
//         {/* <div className="pie-chart">
//           <ResizableBox  style={{ paddingTop: '35px' }} width={300} height={300} minConstraints={[300, 300]} maxConstraints={[800, 600]} >
//             <div className="chart-title">{customHeadings}</div> 
//             <Chart
//               options={options}
//               series={series}
//               type="polarArea"
//               width="100%"
//               height="100%"
//             />
//           </ResizableBox>

//         </div> */}
//                           <div
//                       className="chart-container"
//                       style={{
//                         position: "relative",
//                         width: "100%",
//                         height: "100%",  // Ensure it takes full height of the parent
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center"
//                       }}
//                     >
//                       <ResizableBox
//                         width={width}
//                         height={height}
//                         minConstraints={[300, 300]}
//                         maxConstraints={[1200, 800]}
//                       >
//                         <div
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             border: "none",  // Remove extra border
//                             borderRadius: "8px",
//                             padding: "10px",
//                             background: "#fff",
//                             overflow: "hidden",  // Ensure no overflow
//                           }}
//                         >
//             <Chart
//               options={options}
//               series={series}
//               type="polarArea"
//               width="100%"
//               height="100%"
//             />
//                         </div>
//                       </ResizableBox>
//                     </div>
        
//       </div>


//     </div>
//   );
// }

// export default Pie;























import React from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import the CSS for the resizable box
import {updateSelectedCategory,updateChartData} from '../../features/ViewChartSlice/viewChartSlice';
import "../charts/tooltip.css"; // Import the CSS for the tooltip
import { sendClickedCategory } from "../../utils/api";

const Pie = ({width = 300, height = 300,...props}) => {
  const { categories, values: stringValues ,x_axis} = props;
  const values = stringValues.map(value => parseFloat(value));
  const dispatch = useDispatch();
  const charts = useSelector((state) => state.viewcharts.charts);
  const handleClicked = async (event, chartContext, config) => {
    // if (!isFilterActive) return;
    const clickedCategoryIndex = config.dataPointIndex;
    const clickedCategory = categories[clickedCategoryIndex];
    try {
      // Trigger the API call to send the clicked category
      const response = await sendClickedCategory(clickedCategory,charts,x_axis);
      console.log("chart_data_list:", response.chart_data_list)
      response.chart_data_list.forEach((chartData) => {
          const { chart_id, data } = chartData;
          dispatch(updateChartData({
            chart_id,
            categories: data.categories,
            values: data.values,
            series1:data.series1,
            series2:data.series2,
          }));
        });
  } catch (error) {
      console.error(`Failed to send category ${clickedCategory}:`, error);
  }

    dispatch(updateSelectedCategory(clickedCategory));
   
  };


console.log("height and width",height,width)  
const options = {
  chart: {
      events: {
        dataPointSelection: handleClicked
      },
      id: "basic-pie"
    },
    labels: categories || [],
  fill: {
      opacity: 1
  },
  stroke: {
      width: 1,
      // colors: ['#fff']
  },
  yaxis: {
      show: false,
      labels: {
          formatter: function (value) {
              return parseFloat(value).toFixed(2);
          },
      }
  },
  plotOptions: {
      polarArea: {
          rings: {
              strokeWidth: 0
          },
          spokes: {
              strokeWidth: 0
          },
      }
  },
  dataLabels: {
      enabled: false,
      formatter: function (val, opts) {
          return val;
      },
      offsetY: -2,
      style: {
          fontSize: '12px',
          // colors: ["#304758"]
      }
  },
  grid: {
      // borderColor: '#f1f3fa'
  }
};

const series = values || [];
  return (
    <div className="app">
      <div className="row">
                          <div
                      className="chart-container"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",  // Ensure it takes full height of the parent
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <ResizableBox
                        width={width}
                        height={height}
                        minConstraints={[300, 300]}
                        maxConstraints={[1200, 800]}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",  // Remove extra border
                            borderRadius: "8px",
                            padding: "10px",
                            background: "#fff",
                            overflow: "hidden",  // Ensure no overflow
                          }}
                        >
            <Chart
              options={options}
              series={series}
              type="polarArea"
              width="100%"
              height="100%"
            />
                        </div>
                      </ResizableBox>
                    </div>
        
      </div>


    </div>
  );
}

export default Pie;


