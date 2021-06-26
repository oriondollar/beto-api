import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import { Html } from "react-konva-utils";

const RelationCanvas = (props) => {
  console.log('relationcanvas rendered');
  return (
    <Stage
      width={props.abDim.width}
      height={props.abDim.height}
      offsetX={props.abDim.offsetX}
      offsetY={props.abDim.offsetY}
      padding={10}  
    >
      <Layer>
        <Html>{props.text}</Html>
        {/* {Array.prototype.map.call(props.entityDims, (entityDim) => (
          <Rect
            x={entityDim.x}
            y={entityDim.y}
            width={entityDim.width}
            height={entityDim.height}
            fill="red"
          />
        ))} */}
      </Layer>
    </Stage>
  );
};

export default RelationCanvas;
