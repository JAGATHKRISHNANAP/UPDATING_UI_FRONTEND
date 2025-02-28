// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import * as d3 from 'd3';
// import { ResizableBox } from 'react-resizable';
// import { setClickedCategory } from '../../features/drillDownChartSlice/drillDownChartSlice';
// import '../charts/tooltip.css';
// import { fetchHierarchialDrilldownDataAPI } from '../../utils/api';

// const D3HierarchialBarChart = ({ categories = [], values = [], aggregation,x_axis, y_axis ,tableName,chartColor}) => {
//     const dispatch = useDispatch();
//     const lineColor = useSelector((state) => state.chartColor.chartColor);
//     const databaseName = localStorage.getItem('company_name');
//     const selectedTable = useSelector((state) => state.dashboard.checkedPaths);
//     const svgRef = useRef(null);
//     const [chartData, setChartData] = useState({ categories, values });
//     const [drillStack, setDrillStack] = useState([]);
//     const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 300 });
//     const tooltipRef = useRef(null);

//     console.log("ChartColor===========================",lineColor)

//     console.log("categories===========================",categories)
//     console.log("values===============================",values)
//     console.log("x_axis===============================",x_axis)
//     console.log("y_axis===============================",y_axis)
//     console.log("aggregation==========================",aggregation)
//     console.log("selectedTable========================",selectedTable)
//     console.log("databaseName=========================",databaseName)

//     useEffect(() => {
//         // Update chartData whenever categories or values change
//         setChartData({ categories, values });
//     }, [categories, values]);


//     const handleClicked = async (event, clickedCategoryIndex) => {
//         const clickedCategory = chartData.categories[clickedCategoryIndex];
//         dispatch(setClickedCategory(clickedCategory));
//         console.log("clicked Category:", clickedCategory);
    
//         try {
//             const responseData = await fetchHierarchialDrilldownDataAPI({
//                 clickedCategory: clickedCategory,
//                 xAxis: x_axis,
//                 yAxis: y_axis,
//                 selectedTable: tableName,
//                 aggregate: aggregation,
//                 databaseName: databaseName,
//                 currentLevel: drillStack.length,
//             });
    
//             // Update chart data and drill stack if valid response is received
//             if (responseData.categories && responseData.values) {
//                 setDrillStack([...drillStack, chartData]);
//                 setChartData({ categories: responseData.categories, values: responseData.values });
//             } else {
//                 console.log("No further levels to drill down.");
//             }
//         } catch (error) {
//             console.error('Failed to fetch drilldown data:', error);
//         }
//     };

//     const handleDrillUp = () => {
//         if (drillStack.length > 0) {
//             const previousData = drillStack[drillStack.length - 1];
//             setChartData(previousData);
//             setDrillStack(drillStack.slice(0, -1));
//         }
//     };

//     useEffect(() => {
//         if (!chartData.categories.length || !chartData.values.length) return;
    
//         const sortedData = chartData.categories
//             .map((category, index) => ({ category, value: chartData.values[index] }))
//             .sort((a, b) => b.value - a.value);
    
//         const sortedCategories = sortedData.map((d) => d.category);
//         const sortedValues = sortedData.map((d) => d.value);
    
//         const { width, height } = chartDimensions;
//         const margin = { top: 50, right: 30, bottom: 20, left: 100 };
//         const adjustedWidth = width - margin.left - margin.right;
//         const adjustedHeight = height - margin.top - margin.bottom;
    
//         const svg = d3.select(svgRef.current);
//         svg.selectAll('*').remove();
    
//         const x = d3.scaleLinear()
//             .domain([0, d3.max(sortedValues)])
//             .range([0, adjustedWidth]);
    
//         const y = d3.scaleBand()
//             .domain(sortedCategories)
//             .range([0, adjustedHeight])
//             .padding(0.1);
    
//         const g = svg.append('g')
//             .attr('transform', `translate(${margin.left},${margin.top})`);
    
//         g.append('g')
//             .call(d3.axisTop(x).ticks(5))
//             .selectAll('text')
//             .attr('transform', 'rotate(-45)')
//             .style('text-anchor', 'start');
    
//         g.append('g')
//             .call(d3.axisLeft(y).tickSizeOuter(0));
    
//         g.selectAll('rect')
//             .data(sortedData)
//             .enter()
//             .append('rect')
//             .attr('y', (d) => y(d.category))
//             .attr('height', y.bandwidth())
//             .attr('fill', chartColor)
//             .attr('width', 0)
//             .transition()
//             .duration(750)
//             .attr('width', d => x(d.value))
//             .ease(d3.easeCubicInOut);
    
//         const tooltip = d3.select(tooltipRef.current);
    
//         g.selectAll('rect')
//             .on('click', (event, d) => {
//                 const clickedCategoryIndex = chartData.categories.indexOf(d.category);
//                 handleClicked(event, clickedCategoryIndex);
//             })
//             .on('mouseover', (event, d) => {
//                 tooltip
//                     .style('top', `${event.pageY}px`)
//                     .style('left', `${event.pageX}px`)
//                     .html(`<strong>Category:</strong> ${d.category}<br /><strong>Value:</strong> ${d.value}`)
//                     .attr('class', 'tooltip visible');
//             })
//             .on('mousemove', (event) => {
//                 tooltip.style('top', `${event.pageY}px`).style('left', `${event.pageX}px`);
//             })
//             .on('mouseout', () => {
//                 tooltip.attr('class', 'tooltip');
//             });
    
//         // Click event to SVG to handle drilling up
//         svg.on("click", function(event) {
//             const clickedElement = event.target;
//             if (clickedElement.tagName !== 'rect') {
//                 handleDrillUp();
//             }
//         });
    
//     }, [chartData, lineColor, chartDimensions, x_axis, y_axis,aggregation]);  // Add x_axis and y_axis as dependencies
    

//     const onResize = (event, { size }) => {
//         setChartDimensions({ width: size.width, height: size.height });
//     };

//     return (
//         <div className="app">
//             <div className="row">
//                 <div className="d3-bar-chart">
//                     <ResizableBox
//                         width={chartDimensions.width}
//                         height={chartDimensions.height}
//                         minConstraints={[300, 300]}
//                         maxConstraints={[1200, 800]}
//                         onResize={onResize}
//                     >
//                         <svg ref={svgRef} width="100%" height="100%" />
//                         <div ref={tooltipRef} className="tooltip"></div>
//                     </ResizableBox>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default D3HierarchialBarChart;









import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as d3 from 'd3';
import { ResizableBox } from 'react-resizable';
import { setClickedCategory } from '../../features/drillDownChartSlice/drillDownChartSlice';
import '../charts/tooltip.css';
import { fetchHierarchialDrilldownDataAPI } from '../../utils/api';

const D3HierarchialBarChart = ({width = 300, height = 300, categories = [], values = [], aggregation,x_axis, y_axis ,tableName,chartColor}) => {
    const dispatch = useDispatch();
    const lineColor = useSelector((state) => state.chartColor.chartColor);
    const databaseName = localStorage.getItem('company_name');
    const svgRef = useRef(null);
    const [chartData, setChartData] = useState({ categories, values });
    const [drillStack, setDrillStack] = useState([]);
    // const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 300 });
    const tooltipRef = useRef(null);

    // console.log("chartDimensions===========================",chartDimensions)  


    useEffect(() => {
        // Update chartData whenever categories or values change
        setChartData({ categories, values });
    }, [categories, values]);


    const handleClicked = async (event, clickedCategoryIndex) => {
        const clickedCategory = chartData.categories[clickedCategoryIndex];
        dispatch(setClickedCategory(clickedCategory));
        console.log("clicked Category:", clickedCategory);
    
        try {
            const responseData = await fetchHierarchialDrilldownDataAPI({
                clickedCategory: clickedCategory,
                xAxis: x_axis,
                yAxis: y_axis,
                selectedTable: tableName,
                aggregate: aggregation,
                databaseName: databaseName,
                currentLevel: drillStack.length,
            });
    
            // Update chart data and drill stack if valid response is received
            if (responseData.categories && responseData.values) {
                setDrillStack([...drillStack, chartData]);
                setChartData({ categories: responseData.categories, values: responseData.values });
            } else {
                console.log("No further levels to drill down.");
            }
        } catch (error) {
            console.error('Failed to fetch drilldown data:', error);
        }
    };

    const handleDrillUp = () => {
        if (drillStack.length > 0) {
            const previousData = drillStack[drillStack.length - 1];
            setChartData(previousData);
            setDrillStack(drillStack.slice(0, -1));
        }
    };

    useEffect(() => {
        if (!chartData.categories.length || !chartData.values.length) return;
    
        const sortedData = chartData.categories
            .map((category, index) => ({ category, value: chartData.values[index] }))
            .sort((a, b) => b.value - a.value);
    
        const sortedCategories = sortedData.map((d) => d.category);
        const sortedValues = sortedData.map((d) => d.value);
    
        // const { width, height } = chartDimensions;
        const margin = { top: 50, right: 30, bottom: 20, left: 100 };
        const adjustedWidth = width - margin.left - margin.right;
        const adjustedHeight = height - margin.top - margin.bottom;
    
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
    
        const x = d3.scaleLinear()
            .domain([0, d3.max(sortedValues)])
            .range([0, adjustedWidth]);
    
        const y = d3.scaleBand()
            .domain(sortedCategories)
            .range([0, adjustedHeight])
            .padding(0.1);
    
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        g.append('g')
            .call(d3.axisTop(x).ticks(5))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'start');
    
        g.append('g')
            .call(d3.axisLeft(y).tickSizeOuter(0));
    
        g.selectAll('rect')
            .data(sortedData)
            .enter()
            .append('rect')
            .attr('y', (d) => y(d.category))
            .attr('height', y.bandwidth())
            .attr('fill', chartColor)
            .attr('width', 0)
            .transition()
            .duration(750)
            .attr('width', d => x(d.value))
            .ease(d3.easeCubicInOut);
    
        const tooltip = d3.select(tooltipRef.current);
    
        g.selectAll('rect')
            .on('click', (event, d) => {
                const clickedCategoryIndex = chartData.categories.indexOf(d.category);
                handleClicked(event, clickedCategoryIndex);
            })
            .on('mouseover', (event, d) => {
                tooltip
                    .style('top', `${event.pageY}px`)
                    .style('left', `${event.pageX}px`)
                    .html(`<strong>Category:</strong> ${d.category}<br /><strong>Value:</strong> ${d.value}`)
                    .attr('class', 'tooltip visible');
            })
            .on('mousemove', (event) => {
                tooltip.style('top', `${event.pageY}px`).style('left', `${event.pageX}px`);
            })
            .on('mouseout', () => {
                tooltip.attr('class', 'tooltip');
            });
    
        // Click event to SVG to handle drilling up
        svg.on("click", function(event) {
            const clickedElement = event.target;
            if (clickedElement.tagName !== 'rect') {
                handleDrillUp();
            }
        });
    
    }, [chartData, lineColor,  x_axis, y_axis,aggregation]);  // Add x_axis and y_axis as dependencies
    

    // const onResize = (event, { size }) => {
    //     setChartDimensions({ width: size.width, height: size.height });
    // };

    return (

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
                        // onResize={onResize}
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
<svg ref={svgRef} width="100%" height="100%" />
                                        </div>
                      </ResizableBox>
                    </div>
        
    );
};

export default D3HierarchialBarChart;

















// const D3HierarchialBarChart = ({ width = 300, height = 300, categories = [], values = [], aggregation, x_axis, y_axis, tableName, chartColor }) => {
//     const dispatch = useDispatch();
//     const lineColor = useSelector((state) => state.chartColor.chartColor);
//     const databaseName = localStorage.getItem('company_name');
//     const svgRef = useRef(null);
//     const [chartData, setChartData] = useState({ categories, values });
//     const [drillStack, setDrillStack] = useState([]);
//     const tooltipRef = useRef(null);

//     console.log("chart width and height:", width, height);

//     useEffect(() => {
//         // Update chartData whenever categories or values change
//         setChartData({ categories, values });
//     }, [categories, values]);

//     const handleClicked = async (event, clickedCategoryIndex) => {
//         const clickedCategory = chartData.categories[clickedCategoryIndex];
//         dispatch(setClickedCategory(clickedCategory));
//         console.log("clicked Category:", clickedCategory);

//         try {
//             const responseData = await fetchHierarchialDrilldownDataAPI({
//                 clickedCategory: clickedCategory,
//                 xAxis: x_axis,
//                 yAxis: y_axis,
//                 selectedTable: tableName,
//                 aggregate: aggregation,
//                 databaseName: databaseName,
//                 currentLevel: drillStack.length,
//             });

//             if (responseData.categories && responseData.values) {
//                 setDrillStack([...drillStack, chartData]);
//                 setChartData({ categories: responseData.categories, values: responseData.values });
//             } else {
//                 console.log("No further levels to drill down.");
//             }
//         } catch (error) {
//             console.error('Failed to fetch drilldown data:', error);
//         }
//     };

//     const handleDrillUp = () => {
//         if (drillStack.length > 0) {
//             const previousData = drillStack[drillStack.length - 1];
//             setChartData(previousData);
//             setDrillStack(drillStack.slice(0, -1));
//         }
//     };

//     useEffect(() => {
//         if (!chartData.categories.length || !chartData.values.length) return;

//         const sortedData = chartData.categories
//             .map((category, index) => ({ category, value: chartData.values[index] }))
//             .sort((a, b) => b.value - a.value);

//         const sortedCategories = sortedData.map((d) => d.category);
//         const sortedValues = sortedData.map((d) => d.value);

//         const margin = { top: 50, right: 30, bottom: 20, left: 100 };
//         const adjustedWidth = width - margin.left - margin.right;
//         const adjustedHeight = height - margin.top - margin.bottom;

//         const svg = d3.select(svgRef.current);
//         svg.selectAll('*').remove();

//         const x = d3.scaleLinear()
//             .domain([0, d3.max(sortedValues)])
//             .range([0, adjustedWidth]);

//         const y = d3.scaleBand()
//             .domain(sortedCategories)
//             .range([0, adjustedHeight])
//             .padding(0.1);

//         const g = svg.append('g')
//             .attr('transform', `translate(${margin.left},${margin.top})`);

//         g.append('g')
//             .call(d3.axisTop(x).ticks(5))
//             .selectAll('text')
//             .attr('transform', 'rotate(-45)')
//             .style('text-anchor', 'start');

//         g.append('g')
//             .call(d3.axisLeft(y).tickSizeOuter(0));

//         g.selectAll('rect')
//             .data(sortedData)
//             .enter()
//             .append('rect')
//             .attr('y', (d) => y(d.category))
//             .attr('height', y.bandwidth())
//             .attr('fill', chartColor)
//             .attr('width', 0)
//             .transition()
//             .duration(750)
//             .attr('width', d => x(d.value))
//             .ease(d3.easeCubicInOut);

//         const tooltip = d3.select(tooltipRef.current);

//         g.selectAll('rect')
//             .on('click', (event, d) => {
//                 const clickedCategoryIndex = chartData.categories.indexOf(d.category);
//                 handleClicked(event, clickedCategoryIndex);
//             })
//             .on('mouseover', (event, d) => {
//                 tooltip
//                     .style('top', `${event.pageY}px`)
//                     .style('left', `${event.pageX}px`)
//                     .html(`<strong>Category:</strong> ${d.category}<br /><strong>Value:</strong> ${d.value}`)
//                     .attr('class', 'tooltip visible');
//             })
//             .on('mousemove', (event) => {
//                 tooltip.style('top', `${event.pageY}px`).style('left', `${event.pageX}px`);
//             })
//             .on('mouseout', () => {
//                 tooltip.attr('class', 'tooltip');
//             });

//         svg.on("click", function (event) {
//             const clickedElement = event.target;
//             if (clickedElement.tagName !== 'rect') {
//                 handleDrillUp();
//             }
//         });

//     }, [chartData, lineColor, width, height, x_axis, y_axis, aggregation]);

//     return (
//         <div
//             className="chart-container"
//             style={{
//                 position: "relative",
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center"
//             }}
//         >
//             <ResizableBox
//                 width={width}
//                 height={height}
//                 minConstraints={[300, 300]}
//                 maxConstraints={[1200, 800]}
//             >
//                 <div
//                     style={{
//                         width: "100%",
//                         height: "100%",
//                         border: "none",
//                         borderRadius: "8px",
//                         padding: "10px",
//                         background: "#fff",
//                         overflow: "hidden",
//                     }}
//                 >
//                     <svg ref={svgRef} width="100%" height="100%" />
//                 </div>
//             </ResizableBox>
//         </div>
//     );
// };

// export default D3HierarchialBarChart;
