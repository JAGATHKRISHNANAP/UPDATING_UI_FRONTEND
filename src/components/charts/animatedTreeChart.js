import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import './TextChart.css'; 
import { ResizableBox } from 'react-resizable';

const Treemap = ({ categories = [], values = [] }) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const [sliderValue, setSliderValue] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationId, setAnimationId] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const chartColor = useSelector((state) => state.chartColor.chartColor);
    const [boxSize, setBoxSize] = useState({ width: 500, height: 400 });

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenuPosition({ x: event.pageX, y: event.pageY });
        setContextMenuVisible(true);
    };

    const handlePlayPause = () => {
        if (!isPlaying) {
            setIsPlaying(true);
            const id = setInterval(() => {
                setSliderValue((prevValue) => {
                    if (prevValue >= 5) return 0.1;
                    return parseFloat(prevValue) + 0.05;
                });
            }, 4000);
            setAnimationId(id);
        } else {
            setIsPlaying(false);
            clearInterval(animationId);
        }
    };

    useEffect(() => {
        if (!Array.isArray(categories) || !Array.isArray(values) || categories.length === 0 || values.length === 0) {
            return;
        }

        // Adjust values based on the slider
        const adjustedValues = values.map(value => value * sliderValue);

        // Create data structure
        const data = {
            name: "root",
            children: categories.map((category, index) => ({
                name: category,
                value: adjustedValues[index] || 0
            })).sort((a, b) => a.value - b.value) // Sort in ascending order
        };

        const { width, height } = boxSize;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("font-family", "Arial")
            .style("font-size", "12px");

        const tooltip = d3.select(tooltipRef.current);

        const treemapLayout = d3.treemap()
            .size([width, height])
            .padding(5);

        const root = d3.hierarchy(data)
            .sum(d => d.value);

        treemapLayout(root);

        svg.selectAll('g').remove();

        const colorScale = d3.scaleSequential()
            .domain([0, categories.length])
            .interpolator(d3.interpolateLab(
                d3.rgb(chartColor).brighter(4),  
                chartColor
            ));

        const nodes = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block")
                    .style("opacity", 1)
                    .html(`<strong>${d.data.name}</strong>: ${d.data.value}`);

                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .style("stroke", "blue")
                    .style("stroke-width", 3)
                    .style("fill-opacity", 1);
            })
            .on("mousemove", function (event) {
                const svgElement = svgRef.current.getBoundingClientRect(); // Get the SVG bounding box
                tooltip.style("left", `${event.clientX - svgElement.left + 10}px`)
                       .style("top", `${event.clientY - svgElement.top + 10}px`);
            })
            
            .on("mouseout", function () {
                tooltip.style("display", "none");

                d3.select(this).select('rect')
                    .transition()
                    .duration(200)
                    .style("stroke", "#fff") // Reset stroke to normal
                    .style("stroke-width", 1) // Reset stroke width
                    .style("fill-opacity", 0.8); // Reset opacity
            });

        // Animate the rectangles
        nodes.append("rect")
            .attr("width", d => d.x1 - d.x0) // Set the width based on the data
            .attr("height", d => d.y1 - d.y0) // Set the height based on the data
            .attr("fill", (d, i) => colorScale(i))
            .attr("stroke", "#fff")
            .attr("fill-opacity", 0.8)
            .transition()
            .duration(1000)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        // Add text labels
        nodes.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .attr("fill", d => {
                const bgColor = d3.rgb(colorScale(d.index));
                const brightness = bgColor.r * 0.299 + bgColor.g * 0.587 + bgColor.b * 0.114;
                return brightness > 110 ? "#000000" : "#FFFFFF";
            })
            .style("font-size", d => {
                const availableWidth = d.x1 - d.x0;
                const availableHeight = d.y1 - d.y0;
                const minFontSize = Math.min(availableWidth / 5, availableHeight / 3, 14);
                return `${minFontSize}px`;
            })
            .text(d => `${d.data.name}: ${d.data.value}`)
            .transition()
            .duration(4000)
            .style("opacity", 1);

    }, [categories, values, sliderValue, chartColor, boxSize]);

    return (
        <div>
            <div>
                <label>Adjust Data with Scrubber: </label>
                <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.01"
                    value={sliderValue}
                    onChange={handleSliderChange}
                />
                <span>{sliderValue}</span>
                <button onClick={handlePlayPause}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
            </div> 
            <ResizableBox 
                width={boxSize.width} 
                height={boxSize.height} 
                minConstraints={[300, 300]} 
                maxConstraints={[800, 600]} 
                onResize={(event, { size }) => setBoxSize(size)}
                onContextMenu={handleContextMenu}
            >
                <svg ref={svgRef}></svg>
                <div ref={tooltipRef} className="maptooltip" style={{ display: 'none', position: 'absolute', opacity: 0 }}></div>
            </ResizableBox>
        </div>
    );
};

export default Treemap;








