import React from "react"; 
import { Stage, Layer, Rect } from "react-konva";
import { Html } from "react-konva-utils";

const RelationCanvas = (props) => {
  return (
    <Stage
      width={860.325012207031}
      height={110.4000015258789}
      offsetX={89.0250015258789}
      offsetY={83.5999984741211}
      opacity={0.5}
    >
      <Layer>
        <Html>{props.text}</Html>
             <Rect
            x={513.8624877929688}
            y={200.10000610351562}
            width={122.8499984741211} 
            height={12.199999809265137}
            key={"test"}
            fill="red"/>
	 </Layer>
    </Stage>
  );
};

export default RelationCanvas;


