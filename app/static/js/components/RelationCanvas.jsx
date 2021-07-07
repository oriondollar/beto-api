import React, { Component } from "react";
import { Stage, Layer, Arrow } from "react-konva";
import { Html } from "react-konva-utils";

class RelationCanvas extends Component {
  calcPoints = (fromEntId, toEntId) => {
    const fromEnt = this.props.entityDims[fromEntId];
    const toEnt = this.props.entityDims[toEntId];
    const tol = fromEnt.y * 0.01;
    if (fromEnt.y > toEnt.y + tol) {
      // fromEnt is below toEnt;
      let x1 = fromEnt.x + fromEnt.width / 4;
      let y1 = fromEnt.y;
      let x2 = x1;
      let y2 = toEnt.y + 1.3 * toEnt.height;
      let x3 = toEnt.x + toEnt.width / 4;
      let y3 = y2;
      let x4 = x3;
      let y4 = toEnt.y + 1.03 * toEnt.height;
      return [x1, y1, x2, y2, x3, y3, x4, y4];
    }
    if (fromEnt.y + tol < toEnt.y) {
      // fromEnt is above toEnt
      let x1 = fromEnt.x + (fromEnt.width * 3) / 4;
      let y1 = fromEnt.y + fromEnt.height;
      let x2 = x1;
      let y2 = 1.02 * y1;
      let x3 = toEnt.x + (toEnt.width * 3) / 4;
      let y3 = y2;
      let x4 = x3;
      let y4 = 0.99 * toEnt.y;
      return [x1, y1, x2, y2, x3, y3, x4, y4];
    } else {
      // fromEnt is on same line as toEnt 
      let x1 = fromEnt.x + fromEnt.width / 2;
      let y1 = fromEnt.y;
      let x2 = x1;
      let y2 = 0.975 * y1;
      let x3 = toEnt.x + toEnt.width / 2;
      let y3 = y2;
      let x4 = x3;
      let y4 = 0.998 * toEnt.y;
      return [x1, y1, x2, y2, x3, y3, x4, y4];
    }
  };

  getArrowStroke = (type) => {
    if (type == "re res") {
      return "#cc6677";
    }
    if (type == "re prod") {
      return "#332288";
    }
    if (type == "re infl") {
      return "#AA4499";
    }
    if (type == "re char") {
      return "#117733";
    }
    if (type == "re feat") {
      return "#882255";
    }
    if (type == "re use") {
      return "#004488";
    }
    if (type == "re syn") {
      return "#999933";
    }
    if (type == "re exam") {
      return "#997700";
    }
  };

  drawConnections = (connectors) => {
    let connectorArray = connectors.map((c) => {
      return (
        <Arrow
          className={c.type}
          key={connectors.indexOf(c)}
          points={this.calcPoints(c.from, c.to)}
          stroke={this.getArrowStroke(c.type)}
          fill={this.getArrowStroke(c.type)}
          strokeWidth={3}
          pointerWidth={4}
          pointerLength={2}
          tension={0.01}
          opacity={0.5}
        />
      );
    });
    return { connectorArray };
  };

  render() {
    let connectorArray = this.drawConnections(this.props.connectors)[
      "connectorArray"
    ];
    console.log("in render, connectorArray", connectorArray);
    return (
      <Stage
        width={this.props.abDim.width}
        height={this.props.abDim.height}
        offsetX={this.props.abDim.offsetX}
        offsetY={this.props.abDim.offsetY}
      >
        <Layer>
          <Html className="canvas abstract">{this.props.text}</Html>
          {connectorArray}
        </Layer>
      </Stage>
    );
  }
}

export default RelationCanvas;

