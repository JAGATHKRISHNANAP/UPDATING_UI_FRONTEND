import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ResizableBox } from 'react-resizable';
import { updateSelectedCategory,setChartStatus,updateChartData ,updateSelectedCategory_xaxis} from '../../features/ViewChartSlice/viewChartSlice';
import { useDispatch, useSelector } from 'react-redux';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { sendClickedCategory } from '../../utils/api';

const AreaChart = ({ width = 300, height = 300,categories = [], values = [], aggregation = "Aggregation", x_axis="X_axis", y_axis="Y_axis", otherChartCategories = [] }) => {
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.viewcharts.selectedCategory);
    const [showResetButton, setShowResetButton] = useState(false); // State to show/hide the reset button
    const [isFilterActive, setIsFilterActive] = useState(false); // State to manage the filter functionality
    const charts = useSelector((state) => state.viewcharts.charts);
    
    useEffect(() => {
        // console.log("Received categories:",categories);
        // console.log("Received values:", values);
    }, [categories, values]);

    const handleClicked = async (event, chartContext, config) => {
        if (!isFilterActive) return; // If filter is not active, do nothing
    
        const clickedCategoryIndex = config.dataPointIndex;
        const clickedCategory = categories[clickedCategoryIndex];
    
        const isCategoryPresentInAllCharts = otherChartCategories.every(chartCats => chartCats.includes(clickedCategory));
    
        if (!isCategoryPresentInAllCharts) {
            alert("Filter cannot be applied as categories differ between charts.");
            return;
        }
    
        try {
            const response = await sendClickedCategory(clickedCategory, charts, x_axis);
            console.log("chart_data_list:", response.chart_data_list);
            response.chart_data_list.forEach((chartData) => {
                const { chart_id, data } = chartData;
                dispatch(updateChartData({
                    chart_id,
                    categories: data.categories,
                    values: data.values,
                }));
            });
        } catch (error) {
            console.error(`Failed to send category ${clickedCategory}:`, error);
        }
    
        dispatch(updateSelectedCategory(clickedCategory));
        dispatch(updateSelectedCategory_xaxis(x_axis));
        dispatch(setChartStatus(true));
        setShowResetButton(true);
    };
    
    const handleReset = () => {
        dispatch(updateSelectedCategory(null));
        dispatch(setChartStatus(false));
        setShowResetButton(false);
    };

    const handleFilterToggle = () => {
        setIsFilterActive(prevState => !prevState);
    };

    const options = {
        chart: {
            events: {
                dataPointSelection: handleClicked,
            },
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: categories,
            title: {
                text: `${x_axis}`,
              },
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 400,
                    colors: ['#000'],
                },
                rotate: -45,
                show:true
            },

        },
        yaxis: {
            title: {
                text: `${y_axis}`,
            },
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 400,
                    colors: ['#000'],
                },
                formatter: (value) => {
                    if (value >= 10000000) {
                        return (value / 10000000).toFixed(1) + 'M';
                    } else if (value >= 100000) {
                        return (value / 100000).toFixed(1) + 'L';
                    } else if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'K';
                    } else {
                        return value;
                    }
                }
            },
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    return value.toLocaleString();
                }
            }
        },
        fill: {
            type: 'gradient', // To fill the area with gradient
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            }
        },
        title: {
            text: `${aggregation} of ${x_axis} vs. ${y_axis}`,
            align: 'left',
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#263238',
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: '#f1f3fa',
        },
        legend: {
            show: false,
        },
    };

    const series = [{
        name: aggregation,
        data: values,
    }];

    return (
        // <div className="chart-container" style={{ position: 'relative', width: '100%' }}>
        //     <ResizableBox width={300} height={300} minConstraints={[300, 300]} maxConstraints={[1200, 800]}>
        //         <Chart
        //             options={options}
        //             series={series}
        //             type="area" // Change from "line" to "area"
        //             width="100%"
        //             height="100%"
        //         />
        //     </ResizableBox>
        // </div>
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
                    type="area" // Change from "line" to "area"
                    width="100%"
                    height="100%"
                />
                        </div>
                      </ResizableBox>
                    </div>
        
    );
};

export default AreaChart;
