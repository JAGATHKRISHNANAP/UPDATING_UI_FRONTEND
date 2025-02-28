// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import worldGeoJson from '../../assets/geoMap/countries.geo.json'; // GeoJSON file for world map
// import { useDispatch, useSelector } from "react-redux";
// import '../charts/ChoroplethMap.css';   
// // import { ResizableBox } from 'react-resizable';

// const ChoroplethMap = ({width = 300, height = 300, categories = [], values = [] ,chartColor, aggregation = "Aggregation", x_axis="X_axis", y_axis="Y_axis", otherChartCategories = [] }) => {
//     const svgRef = useRef(null);
//     const tooltipRef = useRef(null);
//     const dispatch = useDispatch();
//     const color = useSelector((state) => state.chartColor.chartColor);  // Redux selector for color

//     useEffect(() => {
//         if (!Array.isArray(categories) || !Array.isArray(values) || categories.length === 0 || values.length === 0) {
//             return;
//         }

//         // Create a color scale from white to the selected color from the Redux store
//         const colorScale = d3.scaleLinear()
//             .domain([d3.min(values), d3.max(values)])  // The range of your data values
//             .range(["#ffffff", color]);  // Interpolates between white and the selected color

//         // Create a map of category (country/region) and corresponding value
//         const dataMap = {};
//         categories.forEach((category, i) => {
//             dataMap[category] = values[i];
//         });

//         // const width = 500;
//         // const height = 150;

//         // Clear the SVG canvas
//         d3.select(svgRef.current).selectAll('*').remove();

//         const svg = d3.select(svgRef.current)
//             .attr("width", width)
//             .attr("height", height);

//         // Create a group element to hold the map paths
//         const mapGroup = svg.append('g');

//         const projection = d3.geoMercator()
//             .scale(150)
//             .translate([width / 2, height / 1.5]);

//         const path = d3.geoPath().projection(projection);

//         const tooltip = d3.select(tooltipRef.current);

//         // Bind data and create the map
//         mapGroup.selectAll('path')
//             .data(worldGeoJson.features)
//             .join('path')
//             .attr('d', path)
//             .attr('fill', d => {
//                 // Get country name
//                 const countryName = d.properties.name;
//                 // Get corresponding value from dataMap
//                 const value = dataMap[countryName] || 0; // Default to 0 if no value
//                 return colorScale(value);
//             })
//             .attr('stroke', '#ccc')
//             .attr('stroke-width', 0.5)
//             .on('mouseover', function (event, d) {
//                 const countryName = d.properties.name;
//                 const value = dataMap[countryName] || 'No Data';
//                 tooltip.style("display", "block")
//                     .style("opacity", 1)
//                     .html(`<strong>${countryName}</strong>: ${value}`);
//                 d3.select(this).attr('stroke', '#000');
//             })
//             .on('mousemove', function (event) {
//                 tooltip.style("left", `${event.pageX + 10}px`)
//                     .style("top", `${event.pageY + 10}px`);
//             })
//             .on('mouseout', function () {
//                 tooltip.style("display", "none").style("opacity", 0);
//                 d3.select(this).attr('stroke', '#ccc');
//             });

//         // Create a color legend
//         // const legendWidth = 300;
//         // const legendHeight = 10;

//         const legendSvg = svg.append('g')
//             .attr('transform', `translate(${width - legendWidth - 20},${height - 40})`);

//         const legendScale = d3.scaleLinear()
//             .domain([d3.min(values), d3.max(values)])
//             .range([0, legendWidth]);

//         const legendAxis = d3.axisBottom(legendScale)
//             .ticks(5);

//         // Create a gradient for the legend
//         const gradient = legendSvg.append('defs')
//             .append('linearGradient')
//             .attr('id', 'legend-gradient');

//         gradient.append('stop')
//             .attr('offset', '0%')
//             .attr('stop-color', "#ffffff");  // Start with white

//         gradient.append('stop')
//             .attr('offset', '100%')
//             .attr('stop-color', color);  // End with the selected color from Redux

//         legendSvg.append('rect')
//             .attr('width', legendWidth)
//             .attr('height', legendHeight)
//             .style('fill', 'url(#legend-gradient)');

//         // Append the axis to the legend
//         legendSvg.append('g')
//             .attr('transform', `translate(0, ${legendHeight})`)
//             .call(legendAxis);

//         // Add zoom behavior
//         const zoom = d3.zoom()
//             .scaleExtent([1, 8])  // Set the zoom scale range
//             .on('zoom', (event) => {
//                 mapGroup.attr('transform', event.transform);  // Apply the zoom and pan transformations
//             });

//         // Apply the zoom behavior to the SVG
//         svg.call(zoom);

//     }, [categories, values, color]);  // Also depend on the `color` from Redux

//     return (
//         // <div>
//         //     <svg ref={svgRef}></svg>
//         //     <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
//         // </div>
//                                   <div
//                               className="chart-container"
//                               style={{
//                                 position: "relative",
//                                 width: "100%",
//                                 height: "100%",  // Ensure it takes full height of the parent
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center"
//                               }}
//                             >

          
//                                                 <div
//                                                   style={{
//                                                     width: "100%",
//                                                     height: "100%",
//                                                     border: "none",  // Remove extra border
//                                                     borderRadius: "8px",
//                                                     padding: "10px",
//                                                     background: "#fff",
//                                                     overflow: "hidden",  // Ensure no overflow
//                                                   }}
//                                                 >
//               <svg ref={svgRef}></svg>
//              <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
//                                                 </div>
                       
//                             </div>
//     );
// };

// export default ChoroplethMap;





// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import worldGeoJson from '../../assets/geoMap/countries.geo.json'; // GeoJSON file for world map
// import { useDispatch, useSelector } from "react-redux";
// import '../charts/ChoroplethMap.css';   
// // import { ResizableBox } from 'react-resizable';

// const ChoroplethMap = ({width = 300, height = 300, categories = [], values = [] ,chartColor, aggregation = "Aggregation", x_axis="X_axis", y_axis="Y_axis", otherChartCategories = [] }) => {
//     const svgRef = useRef(null);
//     const tooltipRef = useRef(null);
//     const dispatch = useDispatch();
//     const color = useSelector((state) => state.chartColor.chartColor);  // Redux selector for color

//     useEffect(() => {
//         if (!Array.isArray(categories) || !Array.isArray(values) || categories.length === 0 || values.length === 0) {
//             return;
//         }

//         // Create a color scale from white to the selected color from the Redux store
//         const colorScale = d3.scaleLinear()
//             .domain([d3.min(values), d3.max(values)])  // The range of your data values
//             .range(["#ffffff", color]);  // Interpolates between white and the selected color

//         // Create a map of category (country/region) and corresponding value
//         const dataMap = {};
//         categories.forEach((category, i) => {
//             dataMap[category] = values[i];
//         });

//         // const width = 500;
//         // const height = 150;

//         // Clear the SVG canvas
//         d3.select(svgRef.current).selectAll('*').remove();

//         const svg = d3.select(svgRef.current)
//             .attr("width", width)
//             .attr("height", height);

//         // Create a group element to hold the map paths
//         const mapGroup = svg.append('g');

//         const projection = d3.geoMercator()
//             .scale(150)
//             .translate([width / 2, height / 1.5]);

//         const path = d3.geoPath().projection(projection);

//         const tooltip = d3.select(tooltipRef.current);

//         // Bind data and create the map
//         mapGroup.selectAll('path')
//             .data(worldGeoJson.features)
//             .join('path')
//             .attr('d', path)
//             .attr('fill', d => {
//                 // Get country name
//                 const countryName = d.properties.name;
//                 // Get corresponding value from dataMap
//                 const value = dataMap[countryName] || 0; // Default to 0 if no value
//                 return colorScale(value);
//             })
//             .attr('stroke', '#ccc')
//             .attr('stroke-width', 0.5)
//             .on('mouseover', function (event, d) {
//                 const countryName = d.properties.name;
//                 const value = dataMap[countryName] || 'No Data';
//                 tooltip.style("display", "block")
//                     .style("opacity", 1)
//                     .html(`<strong>${countryName}</strong>: ${value}`);
//                 d3.select(this).attr('stroke', '#000');
//             })
//             .on('mousemove', function (event) {
//                 tooltip.style("left", `${event.pageX + 10}px`)
//                     .style("top", `${event.pageY + 10}px`);
//             })
//             .on('mouseout', function () {
//                 tooltip.style("display", "none").style("opacity", 0);
//                 d3.select(this).attr('stroke', '#ccc');
//             });

//         // Create a color legend
//         const legendWidth = 300;
//         const legendHeight = 10;

//         const legendSvg = svg.append('g')
//             .attr('transform', `translate(${width - legendWidth - 20},${height - 40})`);

//         const legendScale = d3.scaleLinear()
//             .domain([d3.min(values), d3.max(values)])
//             .range([0, legendWidth]);

//         const legendAxis = d3.axisBottom(legendScale)
//             .ticks(5);

//         // Create a gradient for the legend
//         const gradient = legendSvg.append('defs')
//             .append('linearGradient')
//             .attr('id', 'legend-gradient');

//         gradient.append('stop')
//             .attr('offset', '0%')
//             .attr('stop-color', "#ffffff");  // Start with white

//         gradient.append('stop')
//             .attr('offset', '100%')
//             .attr('stop-color', color);  // End with the selected color from Redux

//         legendSvg.append('rect')
//             .attr('width', legendWidth)
//             .attr('height', legendHeight)
//             .style('fill', 'url(#legend-gradient)');

//         // Append the axis to the legend
//         legendSvg.append('g')
//             .attr('transform', `translate(0, ${legendHeight})`)
//             .call(legendAxis);

//         // Add zoom behavior
//         const zoom = d3.zoom()
//             .scaleExtent([1, 8])  // Set the zoom scale range
//             .on('zoom', (event) => {
//                 mapGroup.attr('transform', event.transform);  // Apply the zoom and pan transformations
//             });

//         // Apply the zoom behavior to the SVG
//         svg.call(zoom);

//     }, [categories, values, color]);  // Also depend on the `color` from Redux

//     return (
//         // <div>
//         //     <svg ref={svgRef}></svg>
//         //     <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
//         // </div>
//                                   <div
//                               className="chart-container"
//                               style={{
//                                 position: "relative",
//                                 width: "100%",
//                                 height: "100%",  // Ensure it takes full height of the parent
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center"
//                               }}
//                             >

          
//                                                 <div
//                                                   style={{
//                                                     width: "100%",
//                                                     height: "100%",
//                                                     border: "none",  // Remove extra border
//                                                     borderRadius: "8px",
//                                                     padding: "10px",
//                                                     background: "#fff",
//                                                     overflow: "hidden",  // Ensure no overflow
//                                                   }}
//                                                 >
//               <svg ref={svgRef}></svg>
//              <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
//                                                 </div>
                       
//                             </div>
//     );
// };

// export default ChoroplethMap;

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import worldGeoJson from '../../assets/geoMap/countries.geo.json'; // GeoJSON file for world map
import { useDispatch, useSelector } from "react-redux";
import '../charts/ChoroplethMap.css';

const ChoroplethMap = ({ width = 300, height = 300, categories = [], values = [], chartColor }) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const dispatch = useDispatch();
    const color = useSelector((state) => state.chartColor.chartColor); // Redux selector for color

    useEffect(() => {
        if (!Array.isArray(categories) || !Array.isArray(values) || categories.length === 0 || values.length === 0) {
            return;
        }

        // Create a color scale from white to the selected color from Redux
        const colorScale = d3.scaleLinear()
            .domain([d3.min(values), d3.max(values)])
            .range(["#ffffff", color]);

        // Map categories to values
        const dataMap = {};
        categories.forEach((category, i) => {
            dataMap[category] = values[i];
        });

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const mapGroup = svg.append('g');

        // Dynamically adjust projection scale and translation based on width and height
        const projection = d3.geoMercator()
            .scale(width / 5) // Adjust scale dynamically
            .translate([width / 2, height / 1.5]);

        const path = d3.geoPath().projection(projection);
        const tooltip = d3.select(tooltipRef.current);

        // Draw the map
        mapGroup.selectAll('path')
            .data(worldGeoJson.features)
            .join('path')
            .attr('d', path)
            .attr('fill', d => {
                const countryName = d.properties.name;
                const value = dataMap[countryName] || 0;
                return colorScale(value);
            })
            .attr('stroke', '#ccc')
            .attr('stroke-width', 0.5)
            .on('mouseover', function (event, d) {
                const countryName = d.properties.name;
                const value = dataMap[countryName] || 'No Data';
                tooltip.style("display", "block")
                    .style("opacity", 1)
                    .html(`<strong>${countryName}</strong>: ${value}`);
                d3.select(this).attr('stroke', '#000');
            })
            .on('mousemove', function (event) {
                tooltip.style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on('mouseout', function () {
                tooltip.style("display", "none").style("opacity", 0);
                d3.select(this).attr('stroke', '#ccc');
            });

        // Create a color legend
        const legendWidth = width * 0.4;
        const legendHeight = 10;

        const legendSvg = svg.append('g')
            .attr('transform', `translate(${width - legendWidth - 20},${height - 40})`);

        const legendScale = d3.scaleLinear()
            .domain([d3.min(values), d3.max(values)])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale).ticks(5);

        // Create gradient for legend
        const gradient = legendSvg.append('defs')
            .append('linearGradient')
            .attr('id', 'legend-gradient');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', "#ffffff");

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', color);

        legendSvg.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#legend-gradient)');

        legendSvg.append('g')
            .attr('transform', `translate(0, ${legendHeight})`)
            .call(legendAxis);

    }, [categories, values, color, width, height]); // Depend on width & height to update dynamically

    return (
        <div className="chart-container" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "8px", padding: "10px", background: "#fff", overflow: "hidden" }}>
                <svg ref={svgRef}></svg>
                <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
            </div>
        </div>
    );
};

export default ChoroplethMap;
