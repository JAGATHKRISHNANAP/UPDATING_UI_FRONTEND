// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDashboardTotalRows, fetchDashboardData } from '../../utils/api';
// import { addTextChart, addChartData } from '../../features/viewDashboardSlice/viewDashboardSlice';
// import { Box, Button, ButtonGroup } from "@mui/material";
// import "../Style.css";

// function ViewDashboardSidebar() {
//   const dispatch = useDispatch();
//   const [user_id, setUserId] = React.useState(localStorage.getItem('user_id'));
//   const [chartNamesArray, setChartNamesArray] = useState([]);
//   const chartData = useSelector((state) => state.viewdashboard.dashboard_charts);
//   const testchartData = useSelector((state) => state.viewdashboard.textChart);
//   console.log("chartData:", chartData); 
//   console.log("testchartData:", testchartData);
  
//   useEffect(() => {
//     console.log("Fetching total rows");
//     dispatch(fetchDashboardTotalRows(user_id))
//       .unwrap()
//       .then((response) => {
//         if (response && response.chart_names) {
//           setChartNamesArray(response.chart_names);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching total rows:", err);
//       });
//   }, [dispatch, user_id]);

//   const handleChartButtonClick = (chartNumber, chartName) => {
//     dispatch(fetchDashboardData(chartName))
//       .unwrap()
//       .then((response) => {
//         response.chart_datas.forEach((chartData) => {
//           if (chartData.chart_type === "singleValueChart") {
//             dispatch(addTextChart(chartData));
//           }
//         });

//         const filteredChartData = response.chart_datas.filter(
//           (chartData) => chartData.chart_type !== "singleValueChart"
//         );
//         filteredChartData.forEach((chartData, index) => {
//           dispatch(addChartData({ ...chartData, index }));
//         });
//       })
//       .catch((err) => {
//         console.error("Error fetching chart data:", err);
//       });
//   };
  
//   return (
//     <div className="App">
//       <Box
//         className="editdashsidebar11"
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           overflowX: 'auto',
//           whiteSpace: 'nowrap',
//         }}
//       >
//         <ButtonGroup
//           variant="contained"
//           color="primary"
//           aria-label="outlined primary button group"
//         >
//           {chartNamesArray.map((name, index) => (
//             <Button
//               sx={{
//                 marginLeft: '2px',
//                 marginRight: '2px',
//                 minWidth: '100px',
//                 color: "white",
//                 justifyContent: "center",
//                 maxHeight: '30px',
//                 fontSize: '12px',
//                 textOverflow: 'ellipsis',
//               }}
//               className="x-axis-column"
//               key={index + 1}
//               onClick={() => handleChartButtonClick(index + 1, name)}
//             >
//               {name}
//             </Button>
//           ))}
//         </ButtonGroup>
//       </Box>
//     </div>
//   );
// }

// export default ViewDashboardSidebar;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDashboardTotalRows, fetchDashboardData,deletedashboard } from '../../utils/api';
// import { addTextChart, addChartData } from '../../features/viewDashboardSlice/viewDashboardSlice';
// import { Box, Button, ButtonGroup ,IconButton,Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from "@mui/material";
// import "../Style.css";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CancelIcon from "@mui/icons-material/Cancel";

// function ViewDashboardSidebar() {
//   const dispatch = useDispatch();
//   const [chartNamesArray, setChartNamesArray] = useState([]);
//   const chartData = useSelector((state) => state.viewdashboard.dashboard_charts);
//   const testchartData = useSelector((state) => state.viewdashboard.textChart);
//   const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
//   const [chartToDelete, setChartToDelete] = useState(null); // State to store the chart to delete
//   const [anchorEl, setAnchorEl] = useState(null); // State to manage the context menu anchor
//   const user_id = localStorage.getItem("user_id"); // Fetch user ID from localStorage
  
//   console.log("chartData:", chartData); 
//   console.log("testchartData:", testchartData);
//   console.log("user_id:", user_id);
//   useEffect(() => {
//     const company_name = localStorage.getItem("company_name");
//     console.log("company_name:", company_name);

//     if (!user_id) {
//       console.error("User ID not found in localStorage");
//       return;
//     }

//     console.log("Fetching total rows");
//     dispatch(fetchDashboardTotalRows(user_id))
//       .unwrap()
//       .then((response) => {
//         console.log("API Response:", response);

//         // Validate and process chart_names
//         if (response && response.chart_names && typeof response.chart_names === "object") {
//           const chartNames = Object.values(response.chart_names).flat();
//           setChartNamesArray(chartNames);
//           console.log("Updated Chart Names Array:", chartNames);
//         } else {
//           console.error("chart_names is not an object or has unexpected structure:", response.chart_names);
//           setChartNamesArray([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching total rows:", err);
//         setChartNamesArray([]);
//       });
//   }, [dispatch, user_id]);

//   const handleChartButtonClick = (chartNumber, chartName) => {
//     console.log("Fetching chart data for:", chartName);
//     dispatch(fetchDashboardData(chartName))
//         .unwrap()
//         .then((response) => {
//             console.log("API Response:", response);
//             console.log("Raw chart position data:", response.data[5]);
//             console.log("Raw chart chart type data:", response.data[6]);

//             // Extract chart positions and chart types
//             let chartPositions = [];
//             let chartTypes = [];
//             try {
//                 const rawPositionData = response.data[5];
//                 const cleanedPositionData = rawPositionData.replace(/'/g, '"');
//                 chartPositions = JSON.parse(cleanedPositionData);

//                 const rawChartTypeData = response.data[6];
//                 const cleanedChartTypeData = rawChartTypeData.replace(/'/g, '"');
//                 chartTypes = JSON.parse(cleanedChartTypeData);
//             } catch (error) {
//                 console.error("Error parsing chart data:", error);
//                 return;
//             }

//             // Create a mapping of chartType to position
//             const positionMap = chartTypes.reduce((map, type, index) => {
//                 map[type] = chartPositions[index];
//                 return map;
//             }, {});

//             console.log("Chart position map:", positionMap);

//             // Handle single value charts
//             response.chart_datas.forEach((chartData) => {
//                 if (chartData.chart_type === "singleValueChart") {
//                     dispatch(addTextChart(chartData));
//                 }
//             });

//             // Handle other charts with positions based on chart_type
//             const filteredChartData = response.chart_datas.filter(
//                 (chartData) => chartData.chart_type !== "singleValueChart"
//             );

//             filteredChartData.forEach((chartData, index) => {
//                 const position = positionMap[chartData.chart_type] || { x: 0, y: 0 };
//                 dispatch(addChartData({ ...chartData, position, index }));
//             });
//         })
//         .catch((err) => {
//             console.error("Error fetching chart data:", err);
//         });
// };




// //   const handleChartButtonClick = (chartNumber, chartName) => {
// //     console.log("Fetching chart data for:", chartName);
// //     dispatch(fetchDashboardData(chartName))
// //         .unwrap()
// //         .then((response) => {
// //             console.log("API Response:", response); 
// //             console.log("Raw chart position data:", response.data[5]);
// //             console.log("Raw chart chart type data:", response.data[6]);

// //             // Extract chart positions from response.data[5]
// //             let chartPositions = [];
// //             try {
// //                 const rawData = response.data[5];
// //                 const cleanedData = rawData.replace(/'/g, '"');  // Replace all single quotes with double quotes
// //                 chartPositions = JSON.parse(cleanedData);
// //                 console.log("Parsed chart positions:", chartPositions);
// //             } catch (error) {
// //                 console.error("Error parsing chart positions:", error);
// //             }

// //             // Handle single value charts
// //             response.chart_datas.forEach((chartData) => {
// //                 if (chartData.chart_type === "singleValueChart") {
// //                     dispatch(addTextChart(chartData));
// //                 }
// //             });

// //             // Handle other charts with positions
// //             const filteredChartData = response.chart_datas.filter(
// //                 (chartData) => chartData.chart_type !== "singleValueChart"
// //             );

// //             filteredChartData.forEach((chartData, index) => {
// //                 const position = chartPositions[index] || { x: 0, y: 0 };
// //                 dispatch(addChartData({ ...chartData, position, index }));
// //             });
// //         })
// //         .catch((err) => {
// //             console.error("Error fetching chart data:", err);
// //         });
// // };





//   const handleContextMenu = (event, chartName, index) => {
//     event.preventDefault(); // Prevent default context menu
//     setAnchorEl({
//       mouseX: event.clientX + 2, // Adjust for better alignment
//       mouseY: event.clientY + 4,
//     }); 
//     setChartToDelete({ chartName, index }); // Store chart info for potential deletion
//   };
  
//   const handleCloseContextMenu = () => {
//     setAnchorEl(null); // Reset anchor position
//   };
  

//   // Handle delete option from context menu
//   const handleDeleteFromContextMenu = () => {
//     if (chartToDelete) {
//       const { index, chartName } = chartToDelete;

//       // Open the confirmation dialog
//       setOpenModal(true);
//     }
//     setAnchorEl(null); // Close context menu after action
//   };

//   // Function to handle the deletion confirmation
//   const handleDeleteConfirm = () => {
//     if (chartToDelete) {
//       const { index, chartName } = chartToDelete;

//       // Dispatch delete action
//       dispatch(deletedashboard(chartName)) // Call API to delete chart data from the database
//         .then((response) => {
//           console.log("Chart deleted successfully:", response);

//           // Update the chart names array in the state after successful deletion
//           const updatedChartNames = chartNamesArray.filter((_, idx) => idx !== index);
//           setChartNamesArray(updatedChartNames);

//           // Optionally, update the Redux state (if required) or trigger any other actions
//         })
//         .catch((err) => {
//           console.error("Error deleting chart:", err);
//         });
//       setOpenModal(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   return (
//     <div className="App">
//       <Box
//         className="editdashsidebar11"
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           overflowX: 'auto',
//           whiteSpace: 'nowrap',
//         }}
//       >
//         <ButtonGroup
//           variant="contained"
//           color="primary"
//           aria-label="outlined primary button group"
//         >
//           {chartNamesArray.map((name, index) => (
//             <Button
//               sx={{
//                 marginLeft: '2px',
//                 marginRight: '2px',
//                 minWidth: '100px',
//                 color: "white",
//                 justifyContent: "center",
//                 maxHeight: '30px',
//                 fontSize: '12px',
//                 textOverflow: 'ellipsis',
//               }}
//               className="x-axis-column"
//               key={index + 1}
//               onClick={() => handleChartButtonClick(index + 1, name)}
//               onContextMenu={(event) => handleContextMenu(event, name, index)} // Right-click to open context menu
//               >
//               {name}
//             </Button>
//           ))}
//         </ButtonGroup>
//       </Box>
//       <Menu
//   anchorReference="anchorPosition"
//   anchorPosition={
//     anchorEl
//       ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
//       : undefined
//   }
//   open={Boolean(anchorEl)}
//   onClose={handleCloseContextMenu}
//   sx={{
//     boxShadow: 1,
//     borderRadius: "6px",
//     padding: "0px",
//     minWidth: "160px", 
//   }}
// >
//   {/* Delete Option */}
//   <MenuItem
//     onClick={handleDeleteFromContextMenu}
//     sx={{
//       fontSize: "12px", 
//       fontWeight: "300", 
//       color: "black", 
//       padding: "10px 20px", 
//       display: "flex",
//       alignItems: "center",
//       "&:hover": {
//         backgroundColor: "#f5f5f5", // Subtle gray hover effect for a cleaner look
//       },
//     }}
//   >
//     <DeleteIcon sx={{ marginRight: 1, color: 'grey' }} /> 
//     Delete 
//   </MenuItem>

//   {/* Cancel Option */}
//   <MenuItem
//     onClick={handleCloseContextMenu}
//     sx={{
//       fontSize: "12px",
//       fontWeight: "300",
//       color: "black", 
//       padding: "10px 20px", 
//       display: "flex",
//       alignItems: "center",
//       "&:hover": {
//         backgroundColor: "#f5f5f5", 
//       },
//     }}
//   >
//     <CancelIcon sx={{ marginRight: 1, color: 'grey' }} />
//     Cancel
//   </MenuItem>
// </Menu>

//       {/* Confirmation Dialog */}
//       <Dialog open={openModal} onClose={() => setOpenModal(false)}>
//         <DialogTitle>Delete Chart</DialogTitle>
//         <DialogContent>
//           {/* Display chart name in the modal */}
//           <p>Are you sure you want to delete the chart: <strong>{chartToDelete ? chartToDelete.chartName : ""}</strong>?</p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="secondary">
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
// export default ViewDashboardSidebar;





// CLEANED ABOVE CODE IS BELOW







import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardTotalRows, fetchDashboardData,deletedashboard } from '../../utils/api';
import { addTextChart, addChartData ,clearDashboard} from '../../features/viewDashboardSlice/viewDashboardSlice';
import { Box, Button, ButtonGroup ,IconButton,Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from "@mui/material";
import "../Style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";

function ViewDashboardSidebar() {
  const dispatch = useDispatch();
  const [chartNamesArray, setChartNamesArray] = useState([]);
  const chartData = useSelector((state) => state.viewdashboard.dashboard_charts);
  const testchartData = useSelector((state) => state.viewdashboard.textChart);
  const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
  const [chartToDelete, setChartToDelete] = useState(null); // State to store the chart to delete
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the context menu anchor
  const user_id = localStorage.getItem("user_id"); // Fetch user ID from localStorage
  const [activeChart, setActiveChart] = useState(null);
  
  console.log("chartData:", chartData); 
  console.log("testchartData:", testchartData);
  console.log("user_id:", user_id);
  useEffect(() => {
    const company_name = localStorage.getItem("company_name");
    console.log("company_name:", company_name);

    if (!user_id) {
      console.error("User ID not found in localStorage");
      return;
    }

    console.log("Fetching total rows");
    dispatch(fetchDashboardTotalRows(user_id))
      .unwrap()
      .then((response) => {
        console.log("API Response:", response);

        // Validate and process chart_names
        if (response && response.chart_names && typeof response.chart_names === "object") {
          const chartNames = Object.values(response.chart_names).flat();
          setChartNamesArray(chartNames);
          console.log("Updated Chart Names Array:", chartNames);
        } else {
          console.error("chart_names is not an object or has unexpected structure:", response.chart_names);
          setChartNamesArray([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching total rows:", err);
        setChartNamesArray([]);
      });
  }, [dispatch, user_id]);

const handleChartButtonClick = (chartNumber, chartName) => {
  console.log("Fetching chart data for:", chartName);
  dispatch(clearDashboard());
  setActiveChart(chartName);

  dispatch(fetchDashboardData(chartName))
      .unwrap()
      // .then((response) => {
      //     console.log("API Response:", response);
      //     console.log("Raw chart position data:", response.data[5]);
      //     console.log("Raw chart sizw:", response.data[6]);
      //     console.log("Raw chart ID data:", response.data[4]);

      //     // Extract chart positions and chart IDs
      //     let chartPositions = [];
      //     let chart_size=[]
      //     let chart_ids = [];

      //     try {
      //         // Handling chart position data
      //         const rawPositionData = response.data[5];
      //         console.log("Raw position data before parsing:", rawPositionData);

      //         if (typeof rawPositionData !== "string") {
      //             throw new Error("chart position data is not a string");
      //         }

      //         const cleanedPositionData = rawPositionData.replace(/'/g, '"');
      //         console.log("Cleaned position data:", cleanedPositionData);

      //         chartPositions = JSON.parse(cleanedPositionData);

      //         // Handling chart ID data
      //         let rawChartIdData = response.data[4];
      //         console.log("Raw chart ID data before parsing:", rawChartIdData);

      //         if (typeof rawChartIdData === "string") {
      //             // Ensure it's formatted as an array
      //             rawChartIdData = rawChartIdData
      //                 .replace(/\{/g, "[") // Convert { to [
      //                 .replace(/\}/g, "]") // Convert } to ]
      //                 .replace(/'/g, '"'); // Ensure double quotes if needed

      //             console.log("Cleaned chart ID data:", rawChartIdData);
      //             chart_ids = JSON.parse(rawChartIdData);
      //         } else if (Array.isArray(rawChartIdData)) {
      //             chart_ids = rawChartIdData; // If already an array, use it directly
      //         } else {
      //             throw new Error("chart ID data is not a valid JSON format");
      //         }
      //     } catch (error) {
      //         console.error("Error parsing chart data:", error);
      //         return;
      //     }

      //     // Create a mapping of chart IDs to positions
      //     const positionMap = chart_ids.reduce((map, id, index) => {
      //         map[id] = chartPositions[index] || { x: 0, y: 0 }; // Default to {x:0, y:0} if missing
      //         return map;
      //     }, {});

      //     console.log("Chart position map:", positionMap);

      //     // Handle single value charts
      //     response.chart_datas.forEach((chartData) => {
      //         if (chartData.chart_type === "singleValueChart") {
      //             dispatch(addTextChart(chartData));
      //             // dispatch(addChartData(chartData));
      //         }
      //     });

      //     // Handle other charts with correct positions
      //     response.chart_datas.forEach((chartData) => {
      //         const chartId = chartData.chart_id; // Assuming chartData has chart_id
      //         const position = positionMap[chartId] || { x: 0, y: 0 };

      //         dispatch(addChartData({ ...chartData, position }));
      //     });
      // })

      .then((response) => {
        console.log("API Response:", response);
        console.log("Raw chart position data:", response.data[5]);
        console.log("Raw chart size:", response.data[6]);  // Fix typo in log
        console.log("Raw chart ID data:", response.data[4]);
    
        // Extract chart positions, chart sizes, and chart IDs
        let chartPositions = [];
        let chartSizes = [];
        let chart_ids = [];
    
        try {
            // Handling chart position data
            const rawPositionData = response.data[5];
            console.log("Raw position data before parsing:", rawPositionData);
    
            if (typeof rawPositionData !== "string") {
                throw new Error("chart position data is not a string");
            }
    
            const cleanedPositionData = rawPositionData.replace(/'/g, '"');
            console.log("Cleaned position data:", cleanedPositionData);
            chartPositions = JSON.parse(cleanedPositionData);
    
            // Handling chart ID data
            let rawChartIdData = response.data[4];
            console.log("Raw chart ID data before parsing:", rawChartIdData);
    
            if (typeof rawChartIdData === "string") {
                rawChartIdData = rawChartIdData
                    .replace(/\{/g, "[") // Convert { to [
                    .replace(/\}/g, "]") // Convert } to ]
                    .replace(/'/g, '"'); // Ensure double quotes if needed
    
                console.log("Cleaned chart ID data:", rawChartIdData);
                chart_ids = JSON.parse(rawChartIdData);
            } else if (Array.isArray(rawChartIdData)) {
                chart_ids = rawChartIdData;
            } else {
                throw new Error("chart ID data is not a valid JSON format");
            }
    
            // Handling chart size data
            let rawSizeData = response.data[6];
            console.log("Raw chart size data before parsing:", rawSizeData);
    
            if (typeof rawSizeData === "string") {
                rawSizeData = rawSizeData.replace(/'/g, '"'); // Convert single quotes to double quotes if needed
                console.log("Cleaned chart size data:", rawSizeData);
                chartSizes = JSON.parse(rawSizeData);
            } else if (Array.isArray(rawSizeData)) {
                chartSizes = rawSizeData;
            } else {
                throw new Error("chart size data is not a valid JSON format");
            }
        } catch (error) {
            console.error("Error parsing chart data:", error);
            return;
        }
    
        // Create a mapping of chart IDs to positions and sizes
        const chartMap = chart_ids.reduce((map, id, index) => {
            map[id] = {
                position: chartPositions[index] || { x: 0, y: 0 }, // Default {x:0, y:0} if missing
                size: chartSizes[index] || { width: 300, height: 300 } // Default size if missing
            };
            return map;
        }, {});
    
        console.log("Chart position & size map:", chartMap);
    
        // Handle single value charts
        response.chart_datas.forEach((chartData) => {
            if (chartData.chart_type === "singleValueChart") {
                dispatch(addTextChart(chartData));
            }
        });
    
        // Handle other charts with correct positions & sizes
        response.chart_datas.forEach((chartData) => {
            const chartId = chartData.chart_id; // Assuming chartData has chart_id
            const { position, size } = chartMap[chartId] || { position: { x: 0, y: 0 }, size: { width: 300, height: 300 } };
    
            dispatch(addChartData({ ...chartData, position, size }));
        });
    })
    
      .catch((err) => {
          console.error("Error fetching chart data:", err);
      });
};




  const handleContextMenu = (event, chartName, index) => {
    event.preventDefault(); // Prevent default context menu
    setAnchorEl({
      mouseX: event.clientX + 2, // Adjust for better alignment
      mouseY: event.clientY + 4,
    }); 
    setChartToDelete({ chartName, index }); // Store chart info for potential deletion
  };
  
  const handleCloseContextMenu = () => {
    setAnchorEl(null); // Reset anchor position
  };
  

  // Handle delete option from context menu
  const handleDeleteFromContextMenu = () => {
    if (chartToDelete) {
      const { index, chartName } = chartToDelete;

      // Open the confirmation dialog
      setOpenModal(true);
    }
    setAnchorEl(null); // Close context menu after action
  };

  // Function to handle the deletion confirmation
  const handleDeleteConfirm = () => {
    if (chartToDelete) {
      const { index, chartName } = chartToDelete;

      // Dispatch delete action
      dispatch(deletedashboard(chartName)) // Call API to delete chart data from the database
        .then((response) => {
          console.log("Chart deleted successfully:", response);

          // Update the chart names array in the state after successful deletion
          const updatedChartNames = chartNamesArray.filter((_, idx) => idx !== index);
          setChartNamesArray(updatedChartNames);

          // Optionally, update the Redux state (if required) or trigger any other actions
        })
        .catch((err) => {
          console.error("Error deleting chart:", err);
        });
      setOpenModal(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="App">
      {/* <Box
        className="editdashsidebar11"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="outlined primary button group"
        >
          {chartNamesArray.map((name, index) => (
            <Button
              sx={{
                marginLeft: '2px',
                marginRight: '2px',
                minWidth: '100px',
                color: "white",
                justifyContent: "center",
                maxHeight: '30px',
                fontSize: '12px',
                textOverflow: 'ellipsis',
              }}
              className="x-axis-column"
              key={index + 1}
              onClick={() => handleChartButtonClick(index + 1, name)}
              onContextMenu={(event) => handleContextMenu(event, name, index)} // Right-click to open context menu
              >
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </Box> */}

<Box

        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "flex-start",
          overflowY: "auto",
          borderTop: "1px solid #768DA3",
         
        }}
      >
        {chartNamesArray.map((name, index) => (
          <Tooltip title={name}>
  <Button
    key={index + 1}
    sx={{
      margin: "4px",
      minWidth: "90px",
      maxWidth: "120px",
      color: "black",
      background: activeChart === name ? "grey" : "white",
      justifyContent: "center",
      maxHeight: "25px",
      fontSize: "12px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      padding: "6px",
      position: "relative",
      display: "inline-flex",
      borderRadius: "4px",
      textTransform: "none",
      border: "2px solid #D3D3D3",
      "&:hover": { backgroundColor: "#f0f0f0" },
    }}
    onClick={() => handleChartButtonClick(index + 1, name)}
    onContextMenu={(event) => handleContextMenu(event, name, index)}
    disabled={activeChart === name}
  >
    {name.length > 6 ? `${name.slice(0, 6)}...` : name}
  </Button>
</Tooltip>


        ))}
      </Box>



      <Menu
  anchorReference="anchorPosition"
  anchorPosition={
    anchorEl
      ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
      : undefined
  }
  open={Boolean(anchorEl)}
  onClose={handleCloseContextMenu}
  sx={{
    boxShadow: 1,
    borderRadius: "6px",
    padding: "0px",
    minWidth: "160px", 
  }}
>
  {/* Delete Option */}
  <MenuItem
    onClick={handleDeleteFromContextMenu}
    sx={{
      fontSize: "12px", 
      fontWeight: "300", 
      color: "black", 
      padding: "10px 20px", 
      display: "flex",
      alignItems: "center",
      "&:hover": {
        backgroundColor: "#f5f5f5", // Subtle gray hover effect for a cleaner look
      },
    }}
  >
    <DeleteIcon sx={{ marginRight: 1, color: 'grey' }} /> 
    Delete 
  </MenuItem>

  {/* Cancel Option */}
  <MenuItem
    onClick={handleCloseContextMenu}
    sx={{
      fontSize: "12px",
      fontWeight: "300",
      color: "black", 
      padding: "10px 20px", 
      display: "flex",
      alignItems: "center",
      "&:hover": {
        backgroundColor: "#f5f5f5", 
      },
    }}
  >
    <CancelIcon sx={{ marginRight: 1, color: 'grey' }} />
    Cancel
  </MenuItem>
</Menu>

      {/* Confirmation Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Delete Chart</DialogTitle>
        <DialogContent>
          {/* Display chart name in the modal */}
          <p>Are you sure you want to delete the chart: <strong>{chartToDelete ? chartToDelete.chartName : ""}</strong>?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ViewDashboardSidebar;


