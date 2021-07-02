import React, { Component } from "react";
import { Stage, Layer, Arrow } from "react-konva";
import { Html } from "react-konva-utils";

class RelationCanvas extends Component {
  calcPoints = (fromEntId, toEntId) => {
    console.log("calcPoints");
    // first ent
    const fromEnt = this.props.entityDims[fromEntId];
    const toEnt = this.props.entityDims[toEntId];
    let x1 = fromEnt.x + fromEnt.width / 2;
    let y1 = fromEnt.y;
    let x2 = x1;
    let y2 = y1 * 1.1;
    let x3 = toEnt.x + toEnt.width / 2;
    let y3 = toEnt.y;

    return [x1, y1, x2, y2, x3, y3];
  };

  drawConnections = (connectors) => {
    {
      connectors.map((c) => (
        <Arrow
          points={this.calcPoints(c.from, c.to)}
          stoke="black" //make this dependent on type
          // offset={this.calcOffset(c.from, c.to)}
        />
      ));
    }
  };

  render() {
    return (
      <Stage
        width={this.props.abDim.width}
        height={this.props.abDim.height}
        offsetX={this.props.abDim.offsetX}
        offsetY={this.props.abDim.offsetY}
      >
        <Layer>
          <Html>{this.props.text}</Html>
          {this.drawConnections(this.props.connectors)}
        </Layer>
      </Stage>
    );
  }
}

export default RelationCanvas;

