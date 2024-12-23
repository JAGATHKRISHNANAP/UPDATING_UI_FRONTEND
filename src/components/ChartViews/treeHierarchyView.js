import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../charts/TextChart.css';
import { ResizableBox } from 'react-resizable';

const Dendrogram = ({ x_axis, treeData }) => {
  const [data, setData] = useState(null);
  const [boxSize, setBoxSize] = useState({ width: 300, height: 300 }); // Initialize state for ResizableBox size
  const svgRef = useRef();
  const containerRef = useRef(); // Reference for the container to manage overflow and scroll

  const margin = { top: 20, right: 90, bottom: 30, left: 90 };

  useEffect(() => {
    setData(treeData);
  }, [treeData]);

  useEffect(() => {
    console.log("TreeHierarchy x_axis:", x_axis);
    console.log("TreeHierarchy treeData:", treeData);
  }, [x_axis, treeData]);

  const transformToHierarchy = (flatData) => {
    const hierarchyLevels = x_axis;
    const groupByLevels = (data, levels) => {
      if (levels.length === 0) return data;

      const [currentLevel, ...remainingLevels] = levels;
      const groupedData = d3.group(data, (d) => d[currentLevel]);

      return new Map(
        Array.from(groupedData, ([key, value]) => {
          if (remainingLevels.length > 0) {
            return [key, groupByLevels(value, remainingLevels)];
          }
          return [key, value];
        })
      );
    };

    const nestedData = groupByLevels(flatData, hierarchyLevels);
    const hierarchy = d3.hierarchy(nestedData, ([key, value]) =>
      Array.isArray(value) ? null : Array.from(value)
    );

    hierarchy.each((d) => {
      if (d.depth === 0) {
        d.children = d.children;
      } else {
        d._children = d.children;
        d.children = null;
      }
    });
    return hierarchy;
  };

  const toggleChildren = (d) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  };

  const generateDendrogram = (hierarchicalData) => {
    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);

    const width = boxSize.width;
    const height = boxSize.height;

    svg.selectAll('*').remove();

    const treeLayout = d3.tree().size([height, width - 160]);
    const root = treeLayout(hierarchicalData);
    root.x0 = height / 2;
    root.y0 = 0;

    const updateDendrogram = (source) => {
      const nodes = root.descendants().reverse();
      const links = root.links();

      treeLayout(root);

      const maxDepth = d3.max(root.descendants(), (d) => d.depth);
      const newSvgWidth = Math.max(boxSize.width, maxDepth * 150 + 160);

      svg.attr('width', newSvgWidth);

      container.style('overflow-x', newSvgWidth > boxSize.width ? 'scroll' : 'hidden');

      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });

      const link = svg.selectAll('.link').data(links, (d) => d.target.id);

      link
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return d3
            .linkHorizontal()
            .x((o) => o.y)
            .y((o) => o.x)({
              source: o,
              target: o,
            });
        })
        .merge(link)
        .transition()
        .duration(750)
        .attr('d', d3.linkHorizontal().x((d) => d.y).y((d) => d.x));

      link
        .exit()
        .transition()
        .duration(750)
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return d3
            .linkHorizontal()
            .x((o) => o.y)
            .y((o) => o.x)({
              source: o,
              target: o,
            });
        })
        .remove();

      const node = svg.selectAll('.node').data(nodes, (d) => d.id || (d.id = `${d.data[0]}-${d.depth}`));

      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .on('click', (event, d) => {
          toggleChildren(d);
          updateDendrogram(d);
        });

      nodeEnter.append('circle').attr('r', 10).style('fill', (d) => (d._children ? '#555' : '#999'));

      nodeEnter
        .append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children || d._children ? -12 : 12))
        .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
        .text((d) => d.data[0]);

      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition().duration(750).attr('transform', (d) => `translate(${d.y},${d.x})`);

      nodeUpdate.select('circle').attr('r', 10).style('fill', (d) => (d._children ? '#555' : '#999'));

      const nodeExit = node.exit().transition().duration(750).attr('transform', (d) => `translate(${source.y},${source.x})`).remove();

      nodeExit.select('circle').attr('r', 0);

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    updateDendrogram(root);

    const zoomBehavior = d3.zoom().on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });

    svg.call(zoomBehavior);

    const dragBehavior = d3.drag().on('drag', (event) => {
      svg.attr('transform', `translate(${event.x},${event.y})`);
    });

    svg.call(dragBehavior);
  };

  useEffect(() => {
    if (data) {
      const hierarchicalData = transformToHierarchy(data);
      generateDendrogram(hierarchicalData);
    }
  }, [data, boxSize]);

  return (
    <div
      ref={containerRef}
      style={{
        margin: '10px',
        border: '.5px solid black',
        backgroundColor: 'white',
        marginLeft: '1px',
        width: '100%',
        height: '50%',
        overflow: 'hidden',
      }}
    >
      <ResizableBox
        width={boxSize.width}
        height={boxSize.height}
        minConstraints={[300, 300]}
        maxConstraints={[800, 600]}
        onResize={(event, { size }) => {
          setBoxSize(size);
        }}
        style={{ outline: "none" }}
      >
        <svg ref={svgRef} width={boxSize.width} height={boxSize.height} />
      </ResizableBox>
    </div>
  );
};

export default Dendrogram;
