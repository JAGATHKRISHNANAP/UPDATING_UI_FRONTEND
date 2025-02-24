
// import React, { useEffect, useState, lazy, Suspense } from 'react';
// import { AiMLchartData } from '../../utils/api';

// // Dynamically import chart components
// const LineChart = lazy(() => import('../ChartViews/linechartview'));
// const BarChart = lazy(() => import('../ChartViews/barchartView'));
// const PieChart = lazy(() => import('../ChartViews/piechartView'));
// const AreaChart = lazy(() => import('../ChartViews/areaChartView'));
// const ScatterChart = lazy(() => import('../ChartViews/scatterChartView'));
// const DualAxisChart = lazy(() => import('../ChartViews/duelAxisChartView'));
// const MapChart = lazy(() => import('../ChartViews/mapChartView'));

// const AllCharts = () => {
//     const [data, setChartData] = useState([]);

//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const data = await AiMLchartData();
//                 console.log("Fetched Data:", data['ai_ml_charts_details']);

//                 if (Array.isArray(data['ai_ml_charts_details'])) {
//                     setChartData(data['ai_ml_charts_details']);
//                 } else {
//                     console.error("Data format error: Expected an array");
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         getData();
//     }, []);

//     console.log("--------------------------------", data);

//     return (
//         <Suspense fallback={<div>Loading Charts...</div>}>
//             <div
//                 style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     justifyContent: 'space-between',
//                     gap: '10px', // Add spacing between charts
//                 }}
//             >
//                 {data.map((chartData, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             backgroundColor: '#ffffff',
//                             border: '1px solid #ddd',
//                             padding: '5px',
//                             borderRadius: '4px',
//                             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             width: '400px', // Fixed width
//                             height: '360px', // Fixed height
//                             overflow: 'hidden', // Prevent content overflow
//                         }}
//                     >
//                         {chartData.chart_type === "line" && (
//                             <LineChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "bar" && (
//                             <BarChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                                 x_axis={chartData.x_axis}
//                                 y_axis={chartData.y_axis}
//                             />
//                         )}
//                         {chartData.chart_type === "pie" && (
//                             <PieChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "area" && (
//                             <AreaChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "scatter" && (
//                             <ScatterChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                                 x_axis={chartData.x_axis}
//                                 y_axis={chartData.y_axis}
//                             />
//                         )}
//                         {chartData.chart_type === "duelAxis" && (
//                             <DualAxisChart
//                                 categories={chartData.categories}
//                                 series1={chartData.series1}
//                                 series2={chartData.series2}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "map" && (
//                             <MapChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </Suspense>
//     );
// };

// export default AllCharts;
















// import React, { useEffect, useState, lazy, Suspense } from 'react';
// import { AiMLchartData } from '../../utils/api';

// // Dynamically import chart components
// const LineChart = lazy(() => import('../ChartViews/linechartview'));
// const BarChart = lazy(() => import('../ChartViews/barchartView'));
// const PieChart = lazy(() => import('../ChartViews/piechartView'));
// const AreaChart = lazy(() => import('../ChartViews/areaChartView'));
// const ScatterChart = lazy(() => import('../ChartViews/scatterChartView'));
// const DualAxisChart = lazy(() => import('../ChartViews/duelAxisChartView'));
// const MapChart = lazy(() => import('../ChartViews/mapChartView'));

// const AllCharts = () => {
//     const [data, setChartData] = useState([]);
//     const [loading, setLoading] = useState(true); // State to track loading

//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const data = await AiMLchartData();
//                 console.log("Fetched Data:", data['ai_ml_charts_details']);

//                 if (Array.isArray(data['ai_ml_charts_details'])) {
//                     setChartData(data['ai_ml_charts_details']);
//                 } else {
//                     console.error("Data format error: Expected an array");
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false); // Stop loading after data fetch
//             }
//         };
//         getData();
//     }, []);

//     console.log("--------------------------------", data);

//     if (loading) {
//         return <div style={{ textAlign: 'center', marginTop: '20px' }}>Charts are loading...</div>;
//     }

//     return (
//         <Suspense fallback={<div>Loading Charts...</div>}>
//             <div
//                 style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     justifyContent: 'space-between',
//                     gap: '10px', // Add spacing between charts
//                 }}
//             >
//                 {data.map((chartData, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             backgroundColor: '#ffffff',
//                             border: '1px solid #ddd',
//                             padding: '5px',
//                             borderRadius: '4px',
//                             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             width: '400px', // Fixed width
//                             height: '360px', // Fixed height
//                             overflow: 'hidden', // Prevent content overflow
//                         }}
//                     >
//                         {chartData.chart_type === "line" && (
//                             <LineChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "bar" && (
//                             <BarChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                                 x_axis={chartData.x_axis}
//                                 y_axis={chartData.y_axis}
//                             />
//                         )}
//                         {chartData.chart_type === "pie" && (
//                             <PieChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "area" && (
//                             <AreaChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "scatter" && (
//                             <ScatterChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                                 x_axis={chartData.x_axis}
//                                 y_axis={chartData.y_axis}
//                             />
//                         )}
//                         {chartData.chart_type === "duelAxis" && (
//                             <DualAxisChart
//                                 categories={chartData.categories}
//                                 series1={chartData.series1}
//                                 series2={chartData.series2}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                         {chartData.chart_type === "map" && (
//                             <MapChart
//                                 categories={chartData.categories}
//                                 values={chartData.values}
//                                 aggregation={chartData.aggregation}
//                             />
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </Suspense>
//     );
// };

// export default AllCharts;






















import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData, delete_Ai_Charts_Datas  } from '../../features/aiCharts/aiChartSlice';
import {setCheckedOptions} from '../../features/Dashboard-Slice/chartSlice';
import { lazy, Suspense } from 'react';

// const BarChart = lazy(() => import('../ChartViews/barchartView'));
const LineChart = lazy(() => import('../ChartViews/linechartview'));
const BarChart = lazy(() => import('../ChartViews/barchartView'));
const PieChart = lazy(() => import('../ChartViews/piechartView'));
const AreaChart = lazy(() => import('../ChartViews/areaChartView'));
const ScatterChart = lazy(() => import('../ChartViews/scatterChartView'));
const DualAxisChart = lazy(() => import('../ChartViews/duelAxisChartView'));
const MapChart = lazy(() => import('../ChartViews/mapChartView'));

const AllCharts = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.aicharts);
    const [selectedCharts, setSelectedCharts] = useState([]);

    useEffect(() => {
        dispatch(fetchChartData());
    }, [dispatch]);

    const handleCheckboxChange = (chartIndex) => {
        setSelectedCharts((prevSelected) =>
            prevSelected.includes(chartIndex)
                ? prevSelected.filter((index) => index !== chartIndex) // Remove if already selected
                : [...prevSelected, chartIndex] // Add if not already selected
        );
    };

    const handleDelete = () => {
        if (selectedCharts.length === 0) {
            alert('No charts selected for deletion.');
            return;
        }
        dispatch(delete_Ai_Charts_Datas (selectedCharts));
        setSelectedCharts([]); // Clear the selected charts
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>Charts are loading...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>Error: {error}</div>;
    }

    return (
        <Suspense fallback={<div>Loading Charts...</div>}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                {data.map((chartData, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #ddd',
                            padding: '5px',
                            borderRadius: '4px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '400px',
                            height: '360px',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCharts.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                Select Chart
                            </label>
                        </div>
                        {/* {chartData.chart_type === 'bar' && (
                            <BarChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                                x_axis={chartData.x_axis}
                                y_axis={chartData.y_axis}
                            />
                        )} */}
                        {chartData.chart_type === "line" && (
                            <LineChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                            />
                        )}
                        {chartData.chart_type === "bar" && (
                            <BarChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                                x_axis={chartData.x_axis}
                                y_axis={chartData.y_axis}
                            />
                        )}
                        {chartData.chart_type === "pie" && (
                            <PieChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                            />
                        )}
                        {chartData.chart_type === "area" && (
                            <AreaChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                            />
                        )}
                        {chartData.chart_type === "scatter" && (
                            <ScatterChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                                x_axis={chartData.x_axis}
                                y_axis={chartData.y_axis}
                            />
                        )}
                        {chartData.chart_type === "duelAxis" && (
                            <DualAxisChart
                                categories={chartData.categories}
                                series1={chartData.series1}
                                series2={chartData.series2}
                                aggregation={chartData.aggregation}
                            />
                        )}
                        {chartData.chart_type === "map" && (
                            <MapChart
                                categories={chartData.categories}
                                values={chartData.values}
                                aggregation={chartData.aggregation}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={handleDelete}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#FF0000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}
                >
                    Delete Selected Charts
                </button>
            </div>
        </Suspense>
    );
};

export default AllCharts;
