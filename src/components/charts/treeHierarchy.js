// // import React, { useState, useEffect, useRef } from 'react';
// // import * as d3 from 'd3';
// // import './TextChart.css';
// // import { fetchHelloData } from '../../utils/api';
// // import { useSelector } from 'react-redux';

// // const Dendrogram = () => {
// //   const [data, setData] = useState(null);
// //   const svgRef = useRef();
// //   const dimensions = { width: 960, height: 600 };
// //   const margin = { top: 20, right: 90, bottom: 30, left: 90 };
// //   const hierarchyLevel = useSelector((state) => state.chart.xAxis);

// //   console.log("hierarchyLevels", hierarchyLevel);

// //   // Fetch the data from the backend and transform it
// //   useEffect(() => {
// //     const getData = async () => {
// //       try {
// //         const result = await fetchHelloData();  // Fetching data from the backend
// //         console.log("result['data frame']----------------", result);
// //         const hierarchicalData = transformToHierarchy(result['data frame']); // Transform fetched data to hierarchy
// //         setData(hierarchicalData);  // Set the hierarchical data to state
// //         console.log("hierarchicalData...........", hierarchicalData); 
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     getData();
// //   }, [hierarchyLevel]); // Add hierarchyLevel as a dependency

// //   // Transform flat data into a hierarchical structure dynamically based on the array of levels
// //   const transformToHierarchy = (flatData) => {
// //     const hierarchyLevels = hierarchyLevel;
// //     console.log("hierarchyLevels", hierarchyLevels);

// //     // Recursively group data based on the levels defined in the hierarchy array
// //     const groupByLevels = (data, levels) => {
// //       if (levels.length === 0) return data; // Base case: no more levels to group

// //       // Group the data by the current level, then recursively group by remaining levels
// //       const [currentLevel, ...remainingLevels] = levels;
// //       const groupedData = d3.group(data, d => d[currentLevel]);

// //       return new Map(Array.from(groupedData, ([key, value]) => {
// //         // Recursively group further if more levels exist
// //         if (remainingLevels.length > 0) {
// //           return [key, groupByLevels(value, remainingLevels)];
// //         }
// //         return [key, value]; // If no more levels, return the grouped value
// //       }));
// //     };

// //     // Create the nested data structure
// //     const nestedData = groupByLevels(flatData, hierarchyLevels);

// //     // Convert the nested data into a d3 hierarchy format
// //     const hierarchy = d3.hierarchy(nestedData, ([key, value]) => Array.isArray(value) ? null : Array.from(value));

// //     // Initially, collapse all nodes except the root
// //     hierarchy.each((d) => {
// //       if (d.depth === 0) {
// //         d.children = d.children;  // Keep the root expanded
// //       } else {
// //         d._children = d.children;  // Collapse all other nodes
// //         d.children = null;
// //       }
// //     });

// //     return hierarchy;
// //   };

// //   // Toggle the children of a node
// //   const toggleChildren = (d) => {
// //     if (d.children) {
// //       d._children = d.children;  // Collapse the children
// //       d.children = null;
// //     } else {
// //       d.children = d._children;  // Expand the children
// //       d._children = null;
// //     }
// //   };

// //   // Function to get color based on the depth
// //   const getNodeColor = (d) => {
// //     const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']; // Darker colors for each level
// //     return colors[d.depth] || '#333';
// //   };

  
// //   const generateDendrogram = (hierarchicalData) => {
// //     const svg = d3.select(svgRef.current);
// //     const width = dimensions.width;
// //     const height = dimensions.height;

// //     svg.selectAll('*').remove();  // Clear previous renderings

// //     const treeLayout = d3.tree().size([height, width - 160]);
// //     const root = treeLayout(hierarchicalData);
// //     root.x0 = height / 2;
// //     root.y0 = 0;

// //     const updateDendrogram = (source) => {
// //       const nodes = root.descendants().reverse();
// //       const links = root.links();

// //       treeLayout(root);

// //       const dynamicWidth = Math.max(
// //         dimensions.width,
// //         nodes.reduce((max, d) => Math.max(max, d.depth * 180), 0) + margin.right + margin.left
// //       );
// //       svg.attr('width', dynamicWidth);

// //       nodes.forEach((d) => {
// //         d.y = d.depth * 180;
// //       });

// //       // ****** Links Section ******
// //       const link = svg.selectAll('.link')
// //         .data(links, (d) => d.target.id);

// //       link.enter().append('path')
// //         .attr('class', 'link')
// //         .attr('d', (d) => {
// //           const o = { x: source.x0, y: source.y0 };
// //           return d3.linkHorizontal()
// //             .x((o) => o.y)
// //             .y((o) => o.x)({ source: o, target: o });
// //         })
// //         .merge(link)
// //         .transition().duration(750)
// //         .attr('d', d3.linkHorizontal()
// //           .x((d) => d.y)
// //           .y((d) => d.x));

// //       link.exit().transition().duration(750)
// //         .attr('d', (d) => {
// //           const o = { x: source.x, y: source.y };
// //           return d3.linkHorizontal()
// //             .x((o) => o.y)
// //             .y((o) => o.x)({ source: o, target: o });
// //         })
// //         .remove();

// //       // ****** Nodes Section ******
// //       const node = svg.selectAll('.node')
// //         .data(nodes, (d) => d.id || (d.id = `${d.data[0]}-${d.depth}`));

// //       const nodeEnter = node.enter().append('g')
// //         .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
// //         .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
// //         .on('click', (event, d) => {
// //           toggleChildren(d);  // Toggle node's children on click
// //           updateDendrogram(d);  // Update the dendrogram after toggle
// //         });

// //       nodeEnter.append('circle')
// //         .attr('r', 10)
// //         .style('fill', (d) => getNodeColor(d)); // Set color based on depth

// //       nodeEnter.append('text')
// //         .attr('dy', '.35em')
// //         .attr('x', (d) => (d.children || d._children ? -12 : 12))
// //         .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
// //         .text((d) => d.data[0]);

// //       const nodeUpdate = nodeEnter.merge(node);
// //       nodeUpdate.transition().duration(750)
// //         .attr('transform', (d) => `translate(${d.y},${d.x})`);

// //       nodeUpdate.select('circle')
// //         .attr('r', 10)
// //         .style('fill', (d) => getNodeColor(d)); // Update color on transition

// //       const nodeExit = node.exit().transition().duration(750)
// //         .attr('transform', (d) => `translate(${source.y},${source.x})`)
// //         .remove();

// //       nodeExit.select('circle').attr('r', 0);

// //       nodes.forEach((d) => {
// //         d.x0 = d.x;
// //         d.y0 = d.y;
// //       });
// //     };

// //     updateDendrogram(root);  // Initial rendering
// //   };

// //   // Effect to generate dendrogram when data or hierarchyLevel is updated
// //   useEffect(() => {
// //     if (data) {
// //       generateDendrogram(data);  // Generate the dendrogram when data is available
// //     }
// //   }, [data]);

// //   console.log("dimensions.height", dimensions.height); 

// //   return (
// //     <div>
// //       <div style={{ margin: '10px', border: '1px solid black', display: 'flex', backgroundColor: 'white', marginLeft: '1px', width: '100%', height: '50%' }}>
// //         <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dendrogram;




























// import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import './TextChart.css';
// import { fetchHelloData } from '../../utils/api';
// import { useSelector } from 'react-redux';

// const Dendrogram = () => {
//   const [data, setData] = useState(null);
//   const svgRef = useRef();
//   const dimensions = { width: 960, height: 600 };
//   const margin = { top: 20, right: 90, bottom: 30, left: 90 };
//   const hierarchyLevel = useSelector((state) => state.chart.xAxis);

//   console.log("hierarchyLevels", hierarchyLevel);

//   // Fetch the data from the backend and transform it
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const result = await fetchHelloData();  // Fetching data from the backend
//         console.log("result['data frame']----------------", result);
//         const hierarchicalData = transformToHierarchy(result['data frame']); // Transform fetched data to hierarchy
//         setData(hierarchicalData);  // Set the hierarchical data to state
//         console.log("hierarchicalData...........", hierarchicalData); 
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     getData();
//   }, [hierarchyLevel]); // Add hierarchyLevel as a dependency

//   // Transform flat data into a hierarchical structure dynamically based on the array of levels
//   const transformToHierarchy = (flatData) => {
//     const hierarchyLevels = hierarchyLevel;
//     console.log("hierarchyLevels", hierarchyLevels);

//     // Recursively group data based on the levels defined in the hierarchy array
//     const groupByLevels = (data, levels) => {
//       if (levels.length === 0) return data; // Base case: no more levels to group

//       // Group the data by the current level, then recursively group by remaining levels
//       const [currentLevel, ...remainingLevels] = levels;
//       const groupedData = d3.group(data, d => d[currentLevel]);

//       return new Map(Array.from(groupedData, ([key, value]) => {
//         // Recursively group further if more levels exist
//         if (remainingLevels.length > 0) {
//           return [key, groupByLevels(value, remainingLevels)];
//         }
//         return [key, value]; // If no more levels, return the grouped value
//       }));
//     };

//     // Create the nested data structure
//     const nestedData = groupByLevels(flatData, hierarchyLevels);

//     // Convert the nested data into a d3 hierarchy format
//     const hierarchy = d3.hierarchy(nestedData, ([key, value]) => Array.isArray(value) ? null : Array.from(value));

//     // Initially, collapse all nodes except the root
//     hierarchy.each((d) => {
//       if (d.depth === 0) {
//         d.children = d.children;  // Keep the root expanded
//       } else {
//         d._children = d.children;  // Collapse all other nodes
//         d.children = null;
//       }
//     });

//     return hierarchy;
//   };

//   // Toggle the children of a node
//   const toggleChildren = (d) => {
//     if (d.children) {
//       d._children = d.children;  // Collapse the children
//       d.children = null;
//     } else {
//       d.children = d._children;  // Expand the children
//       d._children = null;
//     }
//   };

//   // Function to get color based on the depth
//   const getNodeColor = (d) => {
//     const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']; // Darker colors for each level
//     return colors[d.depth] || '#333';
//   };

  
//   const generateDendrogram = (hierarchicalData) => {
//     const svg = d3.select(svgRef.current);
//     const width = dimensions.width;
//     const height = dimensions.height;

//     svg.selectAll('*').remove();  // Clear previous renderings

//     const treeLayout = d3.tree().size([height, width - 160]);
//     const root = treeLayout(hierarchicalData);
//     root.x0 = height / 2;
//     root.y0 = 0;

//     const updateDendrogram = (source) => {
//       const nodes = root.descendants().reverse();
//       const links = root.links();

//       treeLayout(root);

//       const dynamicWidth = Math.max(
//         dimensions.width,
//         nodes.reduce((max, d) => Math.max(max, d.depth * 180), 0) + margin.right + margin.left
//       );
//       svg.attr('width', dynamicWidth);

//       nodes.forEach((d) => {
//         d.y = d.depth * 180;
//       });

//       // ****** Links Section ******
//       const link = svg.selectAll('.link')
//         .data(links, (d) => d.target.id);

//       link.enter().append('path')
//         .attr('class', 'link')
//         .attr('d', (d) => {
//           const o = { x: source.x0, y: source.y0 };
//           return d3.linkHorizontal()
//             .x((o) => o.y)
//             .y((o) => o.x)({ source: o, target: o });
//         })
//         .merge(link)
//         .transition().duration(750)
//         .attr('d', d3.linkHorizontal()
//           .x((d) => d.y)
//           .y((d) => d.x));

//       link.exit().transition().duration(750)
//         .attr('d', (d) => {
//           const o = { x: source.x, y: source.y };
//           return d3.linkHorizontal()
//             .x((o) => o.y)
//             .y((o) => o.x)({ source: o, target: o });
//         })
//         .remove();

//       // ****** Nodes Section ******
//       const node = svg.selectAll('.node')
//         .data(nodes, (d) => d.id || (d.id = `${d.data[0]}-${d.depth}`));

//       const nodeEnter = node.enter().append('g')
//         .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
//         .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
//         .on('click', (event, d) => {
//           toggleChildren(d);  // Toggle node's children on click
//           updateDendrogram(d);  // Update the dendrogram after toggle
//         });

//       nodeEnter.append('circle')
//         .attr('r', 10)
//         .style('fill', (d) => getNodeColor(d)); // Set color based on depth

//       nodeEnter.append('text')
//         .attr('dy', '.35em')
//         .attr('x', (d) => (d.children || d._children ? -12 : 12))
//         .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
//         .text((d) => d.data[0]);

//       const nodeUpdate = nodeEnter.merge(node);
//       nodeUpdate.transition().duration(750)
//         .attr('transform', (d) => `translate(${d.y},${d.x})`);

//       nodeUpdate.select('circle')
//         .attr('r', 10)
//         .style('fill', (d) => getNodeColor(d)); // Update color on transition

//       const nodeExit = node.exit().transition().duration(750)
//         .attr('transform', (d) => `translate(${source.y},${source.x})`)
//         .remove();

//       nodeExit.select('circle').attr('r', 0);

//       nodes.forEach((d) => {
//         d.x0 = d.x;
//         d.y0 = d.y;
//       });
//     };

//     updateDendrogram(root);  // Initial rendering
//   };

//   // Effect to generate dendrogram when data or hierarchyLevel is updated
//   useEffect(() => {
//     if (data) {
//       generateDendrogram(data);  // Generate the dendrogram when data is available
//     }
//   }, [data]);

//   console.log("dimensions.height", dimensions.height); 

//   return (
//     <div>
//       <div style={{ margin: '10px', border: '1px solid black', display: 'flex', backgroundColor: 'white', marginLeft: '1px', width: '100%', height: '50%' }}>
//         <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
//       </div>
//     </div>
//   );
// };

// export default Dendrogram;


































import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Import the CSS for the resizable box
import './tooltip.css';

const WordCloud = ({ categories = [], values = [] }) => {
    const wordCloudRef = useRef(null); // Reference to the SVG container
    const [wordData, setWordData] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);

    // Tooltip div
    const tooltipRef = useRef(null); 
     
    useEffect(() => {
        if (categories && values) {
            // Combine categories and values into a single dataset for word cloud
            const combinedData = categories.map((text, index) => ({
                text,
                size: values[index],
            }));
            console.log("values",combinedData 
            )
                
            // Sort and slice to display the top N words
            const filteredData = combinedData
                .sort((a, b) => b.size - a.size)
                .slice(0, displayCount);

            setWordData(filteredData);
            console.log("filteredData", filteredData);
        }
    }, [categories, values, displayCount]);

    useEffect(() => {
        if (wordData.length > 0) {
            drawWordCloud();
        }
    }, [wordData]);

    const drawWordCloud = () => {
        const { width, height } = { width: 400, height: 400 }; // Dimensions of the word cloud
        const svg = d3.select(wordCloudRef.current);
        svg.selectAll("*").remove(); // Clear existing content

        const fontSizeScale = d3
            .scaleLinear()
            .domain([Math.min(...wordData.map((d) => d.size)), Math.max(...wordData.map((d) => d.size))])
            .range([20, 60]); // Font size range

        const layout = d3Cloud()
            .size([width, height])
            .words(wordData)
            .padding(5)
            .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Random rotation
            .fontSize((d) => fontSizeScale(d.size))
            .on("end", (words) => {
                svg.append("g")
                    .attr("transform", `translate(${width / 2}, ${height / 2})`)
                    .selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .style("font-size", (d) => `${d.size}px`)
                    .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
                    .attr("text-anchor", "middle")
                    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                    .text((d) => d.text)
                    .on("mouseover", (event, d) => {
                        d3.select(event.target)
                            .style("cursor", "pointer")
                            .style("opacity", 0.7); // Add visual effect on hover
                        // Show the tooltip with word information
                        tooltipRef.current.style.visibility = "visible";
                    tooltipRef.current.textContent = `Word: ${d.text}, Frequency: ${d.size}`;
                    tooltipRef.current.style.left = `${event.pageX + 10}px`; // Offset to avoid overlap
                    tooltipRef.current.style.top = `${event.pageY + 10}px`;
                })
                    .on("mouseout", (event) => {
                        d3.select(event.target)
                            .style("cursor", "default")
                            .style("opacity", 1); // Reset visual effect
                        tooltipRef.current.style.visibility = "hidden"; // Hide tooltip on mouseout
                    });
                    
            });

        layout.start();
    };

    const handleSliderChange = (event) => {
        setDisplayCount(Number(event.target.value));
    };

    return (
        <div className="word-cloud-container">
            <ResizableBox width={400} height={400} minConstraints={[300, 300]} maxConstraints={[800, 600]}>
          
                <svg ref={wordCloudRef} width="100%" height="100%" />
                <div className="word-cloud-controls">
                <label>
                    Display Top N Words:
                    <input
                        type="range"
                        min="1"
                        max={categories ? categories.length : 10}
                        value={displayCount}
                        onChange={handleSliderChange}
                    />
                    <span>{displayCount}</span>
                </label>
            </div>
            </ResizableBox>
            {/* Tooltip div */}
            <div 
                ref={tooltipRef} 
                className="wordCloudTooltip"
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    pointerEvents: "none", // Prevent tooltip from interfering with interactions
                }} 
            />
            
        </div>
    );
};

export default WordCloud;