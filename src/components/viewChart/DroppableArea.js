// import React, { useRef } from 'react';
// import { useDrop } from 'react-dnd';

// const DroppableArea = ({ onDrop, children }) => {
//   const droppableAreaRef = useRef(null); // Reference to the drop area

//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'chart',
//     drop: (item) => onDrop(item.chartName),
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={(node) => {
//         droppableAreaRef.current = node; // Set ref
//         drop(node); // Attach the drop functionality to the area
//       }}
//       style={{
//         position: 'relative',
//         backgroundColor: 'white',
//         padding: '10px',
//         border: isOver ? '2px solid #007bff' : '2px solid #ccc',  // Blue border on hover
//         minHeight: '87vh',
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '10px',
//         overflow: 'auto', // Set overflow to 'auto' to allow scrolling if the content exceeds the container
//         borderRadius: '10px',
//         maxHeight: '100%', // Set maximum height to container bounds
//         // width: '100%',
//       }}
//     >
//       {React.Children.map(children, child =>
//         React.cloneElement(child, { droppableAreaRef })
//       )}
//     </div>
//   );
// };

// export default DroppableArea;








// import React, { useRef, useState, useEffect } from "react";
// import { useDrop } from "react-dnd";
// import { Rnd } from "react-rnd";

// const DroppableArea = ({ onDrop, children }) => {
//   const droppableAreaRef = useRef(null);
//   const [positions, setPositions] = useState([]);
//   const [highestZIndex, setHighestZIndex] = useState(1);
//   const [draggingIndex, setDraggingIndex] = useState(null);
//   const [currentDragPosition, setCurrentDragPosition] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   });

//   const handleRemovePosition = (chartName) => {
//     setPositions((prevPositions) =>
//       prevPositions.filter((_, index) => children[index].props.data.chartName !== chartName)
//     );
//   };

//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "chart",
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (offset && droppableAreaRef.current) {
//         const dropX = offset.x - droppableAreaRef.current.getBoundingClientRect().left;
//         const dropY = offset.y - droppableAreaRef.current.getBoundingClientRect().top;
  
//         // Ensure chart is placed at the drop location if available
//         const { x, y } = checkOverlap(dropX, dropY) ? getNextAvailablePosition() : { x: dropX, y: dropY };
  
//         setPositions((prevPositions) => [
//           ...prevPositions,
//           { x, y, width: chartWidth, height: chartHeight, zIndex: highestZIndex + 1,chartName: item.chartName },
//         ]);
  
//         setHighestZIndex((prev) => prev + 1);
//       }
//       onDrop(item.chartName);
//     },
//     collect: (monitor) => ({ isOver: monitor.isOver() }),
//   }));
  
//   const chartWidth = 350;
//   const chartHeight = 400;
//   const gap = 10;
// console.log("positions",positions)  
//   const checkOverlap = (newX, newY) => {
//     return positions.some(
//       (pos) =>
//         newX < pos.x + chartWidth + gap &&
//         newX + chartWidth + gap > pos.x &&
//         newY < pos.y + chartHeight + gap &&
//         newY + chartHeight + gap > pos.y
//     );
//   };

//   const getNextAvailablePosition = () => {
//     if (!droppableAreaRef.current) return { x: 5, y: 5 };

//     const containerWidth = droppableAreaRef.current.clientWidth;
//     const chartsPerRow = Math.floor(containerWidth / (chartWidth + gap));

//     for (let i = 0; ; i++) {
//       const row = Math.floor(i / chartsPerRow);
//       const col = i % chartsPerRow;
//       const newX = col * (chartWidth + gap) + 5;
//       const newY = row * (chartHeight + gap) + 5;

//       if (!checkOverlap(newX, newY)) {
//         return { x: newX, y: newY };
//       }
//     }
//   };

//   useEffect(() => {
//     if (!children.length) return;
//     setPositions((prevPositions) => {
//       if (prevPositions.length >= children.length) return prevPositions;

//       const newPositions = [...prevPositions];

//       for (let i = prevPositions.length; i < children.length; i++) {
//         const { x, y } = getNextAvailablePosition();
//         newPositions.push({
//           x,
//           y,
//           width: chartWidth,
//           height: chartHeight,
//           zIndex: 1,
//         });
//       }
//       return newPositions;
//     });
//   }, [children]);

//   const checkAdjacency = (chartPos, draggedPos) => {
//     const gapSize = gap;

//     // Check right-left adjacency
//     if (
//       Math.abs(draggedPos.x - (chartPos.x + chartPos.width + gapSize)) < 1 &&
//       draggedPos.y < chartPos.y + chartPos.height &&
//       draggedPos.y + draggedPos.height > chartPos.y
//     ) {
//       return true;
//     }

//     // Check left-right adjacency
//     if (
//       Math.abs(chartPos.x - (draggedPos.x + draggedPos.width + gapSize)) < 1 &&
//       draggedPos.y < chartPos.y + chartPos.height &&
//       draggedPos.y + draggedPos.height > chartPos.y
//     ) {
//       return true;
//     }

//     // Check bottom-top adjacency
//     if (
//       Math.abs(draggedPos.y - (chartPos.y + chartPos.height + gapSize)) < 1 &&
//       draggedPos.x < chartPos.x + chartPos.width &&
//       draggedPos.x + draggedPos.width > chartPos.x
//     ) {
//       return true;
//     }

//     // Check top-bottom adjacency
//     if (
//       Math.abs(chartPos.y - (draggedPos.y + draggedPos.height + gapSize)) < 1 &&
//       draggedPos.x < chartPos.x + chartPos.width &&
//       draggedPos.x + draggedPos.width > chartPos.x
//     ) {
//       return true;
//     }

//     return false;
//   };

//   return (
//     <div
//       ref={(node) => {
//         droppableAreaRef.current = node;
//         drop(node);
//       }}
//       style={{
//         position: "relative",
//         backgroundColor: "white",
//         padding: "10px",
//         border: isOver ? "2px solid #007bff" : "2px solid #ccc",
//         minHeight: "82vh",
//         display: "flex",
//         flexWrap: "wrap",
//         gap: "10px",
//         overflow: "auto",
//         borderRadius: "10px",
//         width: "100%",
//       }}
//     >
//       {React.Children.map(children, (child, index) => {
//         const position = positions[index] || {
//           x: 0,
//           y: 0,
//           width: chartWidth,
//           height: chartHeight,
//         };

//         let isAdjacent = false;
//         if (draggingIndex !== null && index !== draggingIndex) {
//           isAdjacent = checkAdjacency(position, currentDragPosition);
//         }

//         return (
//           <Rnd
//             key={index}
//             size={{ width: position.width, height: position.height }}
//             position={{ x: position.x, y: position.y }}
//             style={{
//               border: isAdjacent
//                 ? "2px solid #007bff"
//                 : "1px solid black",
//               backgroundColor: "#f8f9fa",
//               padding: "5px",
//               borderRadius: "8px",
//               zIndex: position.zIndex,
//             }}
//             bounds="parent"
//             enableResizing
//             onDragStart={() => {
//               setDraggingIndex(index);
//               setCurrentDragPosition({
//                 x: position.x,
//                 y: position.y,
//                 width: position.width,
//                 height: position.height,
//               });
//               setPositions((prev) => {
//                 const newPositions = [...prev];
//                 newPositions[index] = {
//                   ...newPositions[index],
//                   zIndex: highestZIndex + 1,
//                 };
//                 return newPositions;
//               });
//               setHighestZIndex((prev) => prev + 1);
//             }}
//             onDrag={(e, data) => {
//               setCurrentDragPosition((prev) => ({
//                 ...prev,
//                 x: data.x,
//                 y: data.y,
//               }));
//             }}

//             onDragStop={(e, d) => {
//               console.log("onDragStop", d);
//               setDraggingIndex(null);
              
//               // Allow slight adjustments but prevent complete overlap
//               const tolerance = 5;
            
//               const isOverlapping = positions.some((pos, i) => {
//                 if (i === index) return false; // Ignore self
            
//                 return (
//                   Math.abs(d.x - pos.x) < chartWidth - tolerance && // Ensure no horizontal overlap
//                   Math.abs(d.y - pos.y) < chartHeight - tolerance   // Ensure no vertical overlap
//                 );
//               });
            
//               if (!isOverlapping) {
//                 setPositions((prev) => {
//                   const newPositions = [...prev];
//                   newPositions[index] = {
//                     x: d.x,
//                     y: d.y,
//                     width: chartWidth,  // Use chartWidth if d.width is undefined
//                     height: chartHeight, // Use chartHeight if d.height is undefined
//                     chartName: positions[index]?.chartName || "Unknown Chart",

//                   };
//                   return newPositions;
//                 });
//               }
//             }}

//             onResizeStop={(e, direction, ref, delta, position) => {
//               setPositions((prev) => {
//                 const newPositions = [...prev];
//                 newPositions[index] = {
//                   ...newPositions[index],
//                   x: position.x,
//                   y: position.y,
//                   width: ref.offsetWidth,
//                   height: ref.offsetHeight,
//                 };
//                 return newPositions;
//               });
//             }}
//           >
//             {React.cloneElement(child,{ onRemovePosition: handleRemovePosition })}
//           </Rnd>
//         );
//       })}
//     </div>
//   );
// };

// export default DroppableArea;












































// import React, { useRef, useState, useEffect } from "react";
// import { useDrop } from "react-dnd";
// import { Rnd } from "react-rnd";
// import { useDispatch, useSelector } from "react-redux";
// import {  setChartPositions,
//   updateChartPosition,
//   addChartPosition,
//   removeChartPosition,} from "../../features/viewDashboardSlice/dashboardpossitionslice";

// const DroppableArea = ({ onDrop, children }) => {
//   const droppableAreaRef = useRef(null);
//   const dispatch = useDispatch(); 
//   const [positions, setPositions] = useState([]);
//   const [highestZIndex, setHighestZIndex] = useState(1);
//   const [draggingIndex, setDraggingIndex] = useState(null);
//   const [currentDragPosition, setCurrentDragPosition] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   });

//   // console.log("onDrop-------------onDrop",onDrop)
//   // console.log("children-------------children",children)  
//   const handleRemovePosition = (chartName) => {
//     setPositions((prevPositions) =>
//       prevPositions.filter((_, index) => children[index].props.data.chartName !== chartName)
//     );
//     // dispatch(removeChartPosition((prevPositions) =>
//     //   prevPositions.filter((_, index) => children[index].props.data.chartName !== chartName)));
//     dispatch(removeChartPosition(chartName));
//   };

//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "chart",
//     drop: (item, monitor) => {
//       const offset = monitor.getClientOffset();
//       if (offset && droppableAreaRef.current) {
//         const dropX = offset.x - droppableAreaRef.current.getBoundingClientRect().left;
//         const dropY = offset.y - droppableAreaRef.current.getBoundingClientRect().top;


//         // console.log("item----------------------- ",item)
  
//         // Ensure chart is placed at the drop location if available
//         const { x, y } = checkOverlap(dropX, dropY) ? getNextAvailablePosition() : { x: dropX, y: dropY };
//         const newPosition = {
//           x,
//           y,
//           width: chartWidth,
//           height: chartHeight,
//           chartName: item?.chartName, // Ensure chartName is properly accessed
//         };
//         setPositions((prevPositions) => [
//           ...prevPositions,
//           { x, y, width: chartWidth, height: chartHeight, zIndex: highestZIndex + 1,chartName: item.chartName },
//         ]);
//         dispatch(addChartPosition(newPosition));
  
//         setHighestZIndex((prev) => prev + 1);
//       }
//       onDrop(item.chartName);
//     },
//     collect: (monitor) => ({ isOver: monitor.isOver() }),
//   }));
  
//   const chartWidth = 350;
//   const chartHeight = 400;
//   const gap = 10;
// console.log("positions",positions)  
//   const checkOverlap = (newX, newY) => {
//     return positions.some(
//       (pos) =>
//         newX < pos.x + chartWidth + gap &&
//         newX + chartWidth + gap > pos.x &&
//         newY < pos.y + chartHeight + gap &&
//         newY + chartHeight + gap > pos.y
//     );
//   };

//   const getNextAvailablePosition = () => {
//     if (!droppableAreaRef.current) return { x: 5, y: 5 };

//     const containerWidth = droppableAreaRef.current.clientWidth;
//     const chartsPerRow = Math.floor(containerWidth / (chartWidth + gap));

//     for (let i = 0; ; i++) {
//       const row = Math.floor(i / chartsPerRow);
//       const col = i % chartsPerRow;
//       const newX = col * (chartWidth + gap) + 5;
//       const newY = row * (chartHeight + gap) + 5;

//       if (!checkOverlap(newX, newY)) {
//         return { x: newX, y: newY };
//       }
//     }
//   };

//   useEffect(() => {
//     if (!children.length) return;
//     setPositions((prevPositions) => {
//       if (prevPositions.length >= children.length) return prevPositions;

//       const newPositions = [...prevPositions];

//       for (let i = prevPositions.length; i < children.length; i++) {
//         const { x, y } = getNextAvailablePosition();
//         newPositions.push({
//           x,
//           y,
//           width: chartWidth,
//           height: chartHeight,
//           // zIndex: 1,
//         });
//       }
//       dispatch(setChartPositions(newPositions));
//       return newPositions;
//     });

//   }, [children,dispatch]);

//   const checkAdjacency = (chartPos, draggedPos) => {
//     const gapSize = gap;

//     // Check right-left adjacency
//     if (
//       Math.abs(draggedPos.x - (chartPos.x + chartPos.width + gapSize)) < 1 &&
//       draggedPos.y < chartPos.y + chartPos.height &&
//       draggedPos.y + draggedPos.height > chartPos.y
//     ) {
//       return true;
//     }

//     // Check left-right adjacency
//     if (
//       Math.abs(chartPos.x - (draggedPos.x + draggedPos.width + gapSize)) < 1 &&
//       draggedPos.y < chartPos.y + chartPos.height &&
//       draggedPos.y + draggedPos.height > chartPos.y
//     ) {
//       return true;
//     }

//     // Check bottom-top adjacency
//     if (
//       Math.abs(draggedPos.y - (chartPos.y + chartPos.height + gapSize)) < 1 &&
//       draggedPos.x < chartPos.x + chartPos.width &&
//       draggedPos.x + draggedPos.width > chartPos.x
//     ) {
//       return true;
//     }

//     // Check top-bottom adjacency
//     if (
//       Math.abs(chartPos.y - (draggedPos.y + draggedPos.height + gapSize)) < 1 &&
//       draggedPos.x < chartPos.x + chartPos.width &&
//       draggedPos.x + draggedPos.width > chartPos.x
//     ) {
//       return true;
//     }

//     return false;
//   };

//   return (
//     <div
//       ref={(node) => {
//         droppableAreaRef.current = node;
//         drop(node);
//       }}
//       style={{
//         position: "relative",
//         backgroundColor: "white",
//         padding: "10px",
//         border: isOver ? "2px solid #007bff" : "2px solid #ccc",
//         minHeight: "82vh",
//         display: "flex",
//         flexWrap: "wrap",
//         gap: "10px",
//         overflow: "auto",
//         borderRadius: "10px",
//         width: "100%",
//       }}
//     >
//       {React.Children.map(children, (child, index) => {
//         const position = positions[index] || {
//           x: 0,
//           y: 0,
//           width: chartWidth,
//           height: chartHeight,
//         };

//         let isAdjacent = false;
//         if (draggingIndex !== null && index !== draggingIndex) {
//           isAdjacent = checkAdjacency(position, currentDragPosition);
//         }

//         return (
//           <Rnd
//             key={index}
//             size={{ width: position.width, height: position.height }}
//             position={{ x: position.x, y: position.y }}
//             style={{
//               border: isAdjacent
//                 ? "2px solid #007bff"
//                 : "1px solid black",
//               backgroundColor: "#f8f9fa",
//               padding: "5px",
//               borderRadius: "8px",
//               zIndex: position.zIndex,
//             }}
//             bounds="parent"
//             enableResizing
//             onDragStart={() => {
//               setDraggingIndex(index);
//               setCurrentDragPosition({
//                 x: position.x,
//                 y: position.y,
//                 width: position.width,
//                 height: position.height,
//               });

//               const updatedPosition = {
//                 ...position,
//                 zIndex: highestZIndex + 1,
//               };


//               // setPositions((prev) => {
//               //   const newPositions = [...prev];
//               //   newPositions[index] = {
//               //     ...newPositions[index],
//               //     zIndex: highestZIndex + 1,
//               //   };
//               //   return newPositions;
//               // });
//               setPositions((prev) => {
//                 const newPositions = [...prev];
//                 newPositions[index] = updatedPosition;
//                 return newPositions;
//               });
//               dispatch(
//                 updateChartPosition({
//                   index,
//                   ...updatedPosition,
//                 })
//               );
//               setHighestZIndex((prev) => prev + 1);
//             }}
//             onDrag={(e, data) => {
//               setCurrentDragPosition((prev) => ({
//                 ...prev,
//                 x: data.x,
//                 y: data.y,
//               }));
//             }}

//             onDragStop={(e, d) => {
//               console.log("onDragStop", d);
//               setDraggingIndex(null);
              
//               // Allow slight adjustments but prevent complete overlap
//               const tolerance = 5;
            
//               const isOverlapping = positions.some((pos, i) => {
//                 if (i === index) return false; // Ignore self
            
//                 return (
//                   Math.abs(d.x - pos.x) < chartWidth - tolerance && // Ensure no horizontal overlap
//                   Math.abs(d.y - pos.y) < chartHeight - tolerance   // Ensure no vertical overlap
//                 );
//               });
            
//               // if (!isOverlapping) {
//               //   setPositions((prev) => {
//               //     const newPositions = [...prev];
//               //     newPositions[index] = {
//               //       x: d.x,
//               //       y: d.y,
//               //       width: chartWidth,  // Use chartWidth if d.width is undefined
//               //       height: chartHeight, // Use chartHeight if d.height is undefined
//               //       chartName: positions[index]?.chartName || "Unknown Chart",

//               //     };
//               //     dispatch(updateChartPosition((prev) => {
//               //       const newPositions = [...prev];
//               //       newPositions[index] = {
//               //         x: d.x,
//               //         y: d.y,
//               //         width: chartWidth,  // Use chartWidth if d.width is undefined
//               //         height: chartHeight, // Use chartHeight if d.height is undefined
//               //         chartName: positions[index]?.chartName || "Unknown Chart",
//               //       };
//               //       return newPositions;
//               //     }));
//               //     return newPositions;
//               //   });
//               // }
//               if (!isOverlapping) {
//                 const updatedPosition = {
//                   x: d.x,
//                   y: d.y,
//                   width: chartWidth,
//                   height: chartHeight,
//                   chartName: positions[index]?.chartName || "Unknown Chart",
//                 };
              
//                 setPositions((prev) => {
//                   const newPositions = [...prev];
//                   newPositions[index] = updatedPosition;
//                   return newPositions;
//                 });
              
//                 dispatch(updateChartPosition({ index, ...updatedPosition }));
//               }
              
//             }}

//             // onResizeStop={(e, direction, ref, delta, position) => {
//             //   setPositions((prev) => {
//             //     const newPositions = [...prev];
//             //     newPositions[index] = {
//             //       ...newPositions[index],
//             //       x: position.x,
//             //       y: position.y,
//             //       width: ref.offsetWidth,
//             //       height: ref.offsetHeight,
//             //     };
//             //     dispatch(updateChartPosition((prev) => {
//             //       const newPositions = [...prev];
//             //       newPositions[index] = {
//             //         ...newPositions[index],
//             //         x: position.x,
//             //         y: position.y,
//             //         width: ref.offsetWidth,
//             //         height: ref.offsetHeight,
//             //       };
//             //       return newPositions;
//             //     }));
//             //     return newPositions;
//             //   });
//             // }}

//             onResizeStop={(e, direction, ref, delta, position) => {
//               const updatedPosition = {
//                 x: position.x,
//                 y: position.y,
//                 width: ref.offsetWidth,
//                 height: ref.offsetHeight,
//               };
            
//               setPositions((prev) => {
//                 const newPositions = [...prev];
//                 newPositions[index] = { ...newPositions[index], ...updatedPosition };
//                 return newPositions;
//               });
            
//               dispatch(updateChartPosition({ index, ...updatedPosition }));
//             }}
            
//           >
//             {React.cloneElement(child,{ onRemovePosition: handleRemovePosition })}
//           </Rnd>
//         );
//       })}
//     </div>
//   );
// };

// export default DroppableArea;





















import React, { useRef, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Rnd } from "react-rnd";
import { useDispatch, useSelector } from "react-redux";
import {  setChartPositions,
  updateChartPosition,
  addChartPosition,
  removeChartPosition,} from "../../features/viewDashboardSlice/dashboardpossitionslice";

const DroppableArea = ({ onDrop, children }) => {
  const droppableAreaRef = useRef(null);
  const dispatch = useDispatch(); 
  const [positions, setPositions] = useState([]);
  const [highestZIndex, setHighestZIndex] = useState(1);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [currentDragPosition, setCurrentDragPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleRemovePosition = (chartName) => {
    setPositions((prevPositions) =>
      prevPositions.filter((_, index) => children[index].props.data.chartName !== chartName)
    );
    dispatch(removeChartPosition(chartName));
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "chart",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && droppableAreaRef.current) {
        const dropX = offset.x - droppableAreaRef.current.getBoundingClientRect().left;
        const dropY = offset.y - droppableAreaRef.current.getBoundingClientRect().top;
        const { x, y } = checkOverlap(dropX, dropY) ? getNextAvailablePosition() : { x: dropX, y: dropY };
        const newPosition = {
          x,
          y,
          width: chartWidth,
          height: chartHeight,
          chartName: item?.chartName, // Ensure chartName is properly accessed
        };
        setPositions((prevPositions) => [
          ...prevPositions,
          { x, y, width: chartWidth, height: chartHeight, zIndex: highestZIndex + 1,chartName: item.chartName },
        ]);
        dispatch(addChartPosition(newPosition));
  
        setHighestZIndex((prev) => prev + 1);
      }
      onDrop(item.chartName);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));
  
  const chartWidth = 350;
  const chartHeight = 400;
  const gap = 10;
console.log("positions",positions)  
  const checkOverlap = (newX, newY) => {
    return positions.some(
      (pos) =>
        newX < pos.x + chartWidth + gap &&
        newX + chartWidth + gap > pos.x &&
        newY < pos.y + chartHeight + gap &&
        newY + chartHeight + gap > pos.y
    );
  };

  const getNextAvailablePosition = () => {
    if (!droppableAreaRef.current) return { x: 5, y: 5 };

    const containerWidth = droppableAreaRef.current.clientWidth;
    const chartsPerRow = Math.floor(containerWidth / (chartWidth + gap));

    for (let i = 0; ; i++) {
      const row = Math.floor(i / chartsPerRow);
      const col = i % chartsPerRow;
      const newX = col * (chartWidth + gap) + 5;
      const newY = row * (chartHeight + gap) + 5;

      if (!checkOverlap(newX, newY)) {
        return { x: newX, y: newY };
      }
    }
  };

  useEffect(() => {
    if (!children.length) return;
    setPositions((prevPositions) => {
      if (prevPositions.length >= children.length) return prevPositions;

      const newPositions = [...prevPositions];

      for (let i = prevPositions.length; i < children.length; i++) {
        const { x, y } = getNextAvailablePosition();
        newPositions.push({
          x,
          y,
          width: chartWidth,
          height: chartHeight,
          // zIndex: 1,
        });
      }
      dispatch(setChartPositions(newPositions));
      return newPositions;
    });

  }, [children,dispatch]);

  const checkAdjacency = (chartPos, draggedPos) => {
    const gapSize = gap;

    // Check right-left adjacency
    if (
      Math.abs(draggedPos.x - (chartPos.x + chartPos.width + gapSize)) < 1 &&
      draggedPos.y < chartPos.y + chartPos.height &&
      draggedPos.y + draggedPos.height > chartPos.y
    ) {
      return true;
    }

    // Check left-right adjacency
    if (
      Math.abs(chartPos.x - (draggedPos.x + draggedPos.width + gapSize)) < 1 &&
      draggedPos.y < chartPos.y + chartPos.height &&
      draggedPos.y + draggedPos.height > chartPos.y
    ) {
      return true;
    }

    // Check bottom-top adjacency
    if (
      Math.abs(draggedPos.y - (chartPos.y + chartPos.height + gapSize)) < 1 &&
      draggedPos.x < chartPos.x + chartPos.width &&
      draggedPos.x + draggedPos.width > chartPos.x
    ) {
      return true;
    }

    // Check top-bottom adjacency
    if (
      Math.abs(chartPos.y - (draggedPos.y + draggedPos.height + gapSize)) < 1 &&
      draggedPos.x < chartPos.x + chartPos.width &&
      draggedPos.x + draggedPos.width > chartPos.x
    ) {
      return true;
    }

    return false;
  };

  return (
    <div
      ref={(node) => {
        droppableAreaRef.current = node;
        drop(node);
      }}
      style={{
        position: "relative",
        backgroundColor: "white",
        padding: "10px",
        border: isOver ? "2px solid #007bff" : "2px solid #ccc",
        minHeight: "82vh",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        overflow: "auto",
        borderRadius: "10px",
        width: "100%",
      }}
    >
      {React.Children.map(children, (child, index) => {
        const position = positions[index] || {
          x: 0,
          y: 0,
          width: chartWidth,
          height: chartHeight,
        };

        let isAdjacent = false;
        if (draggingIndex !== null && index !== draggingIndex) {
          isAdjacent = checkAdjacency(position, currentDragPosition);
        }

        return (
          <Rnd
            key={index}
            size={{ width: position.width, height: position.height }}
            position={{ x: position.x, y: position.y }}
            style={{
              border: isAdjacent
                ? "2px solid #007bff"
                : "1px solid black",
              backgroundColor: "#f8f9fa",
              padding: "5px",
              borderRadius: "8px",
              zIndex: position.zIndex,
            }}
            bounds="parent"
            enableResizing
            onDragStart={() => {
              setDraggingIndex(index);
              setCurrentDragPosition({
                x: position.x,
                y: position.y,
                width: position.width,
                height: position.height,
              });

              const updatedPosition = {
                ...position,
                zIndex: highestZIndex + 1,
              };

              setPositions((prev) => {
                const newPositions = [...prev];
                newPositions[index] = updatedPosition;
                return newPositions;
              });
              dispatch(
                updateChartPosition({
                  index,
                  ...updatedPosition,
                })
              );
              setHighestZIndex((prev) => prev + 1);
            }}
            onDrag={(e, data) => {
              setCurrentDragPosition((prev) => ({
                ...prev,
                x: data.x,
                y: data.y,
              }));
            }}

            // onDragStop={(e, d) => {
            //   console.log("onDragStop", d);
            //   setDraggingIndex(null);
              
            //   // Allow slight adjustments but prevent complete overlap
            //   const tolerance = 5;
            
            //   const isOverlapping = positions.some((pos, i) => {
            //     if (i === index) return false; // Ignore self
            
            //     return (
            //       Math.abs(d.x - pos.x) < chartWidth - tolerance && // Ensure no horizontal overlap
            //       Math.abs(d.y - pos.y) < chartHeight - tolerance   // Ensure no vertical overlap
            //     );
            //   });
  
            //   if (!isOverlapping) {
            //     const updatedPosition = {
            //       x: d.x,
            //       y: d.y,
            //       width: chartWidth,
            //       height: chartHeight,
            //       chartName: positions[index]?.chartName || "Unknown Chart",
            //     };
              
            //     setPositions((prev) => {
            //       const newPositions = [...prev];
            //       newPositions[index] = updatedPosition;
            //       return newPositions;
            //     });
              
            //     dispatch(updateChartPosition({ index, ...updatedPosition }));
            //   }
              
            // }}
            // onResizeStop={(e, direction, ref, delta, position) => {
            //   const updatedPosition = {
            //     x: position.x,
            //     y: position.y,
            //     width: ref.offsetWidth,
            //     height: ref.offsetHeight,
            //     chartName: positions[index]?.chartName || "Unknown Chart"
            //   };
            
            //   setPositions((prev) => {
            //     const newPositions = [...prev];
            //     newPositions[index] = { ...newPositions[index], ...updatedPosition };
            //     return newPositions;
            //   });
            
            //   dispatch(updateChartPosition({ index, ...updatedPosition }));
            
            
            
            // }}
            
            onDragStop={(e, d) => {
              console.log("onDragStop", d);
              setDraggingIndex(null);
            
              // Get current width and height from state
              const currentWidth = positions[index]?.width || chartWidth;
              const currentHeight = positions[index]?.height || chartHeight;
            
              // Allow slight adjustments but prevent complete overlap
              const tolerance = 5;
            
              const isOverlapping = positions.some((pos, i) => {
                if (i === index) return false; // Ignore self
            
                return (
                  Math.abs(d.x - pos.x) < currentWidth - tolerance && // Ensure no horizontal overlap
                  Math.abs(d.y - pos.y) < currentHeight - tolerance   // Ensure no vertical overlap
                );
              });
            
              if (!isOverlapping) {
                const updatedPosition = {
                  x: d.x,
                  y: d.y,
                  width: currentWidth,  // Use current width
                  height: currentHeight, // Use current height
                  chartName: positions[index]?.chartName || "Unknown Chart",
                };
            
                setPositions((prev) => {
                  const newPositions = [...prev];
                  newPositions[index] = updatedPosition;
                  return newPositions;
                });
            
                dispatch(updateChartPosition({ index, ...updatedPosition }));
              }
            }}
            
            
            onResizeStop={(e, direction, ref, delta, position) => {
              const updatedPosition = {
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,  // Store resized width
                height: ref.offsetHeight, // Store resized height
                chartName: positions[index]?.chartName || "Unknown Chart"
              };
            
              setPositions((prev) => {
                const newPositions = [...prev];
                newPositions[index] = updatedPosition;
                return newPositions;
              });
            
              dispatch(updateChartPosition({ index, ...updatedPosition }));
            }}
            
            
          >
            {React.cloneElement(child,{ onRemovePosition: handleRemovePosition })}
          </Rnd>
        );
      })}
    </div>
  );
};

export default DroppableArea;

