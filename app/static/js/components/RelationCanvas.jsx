import React, { Component } from "react";
import { Stage, Layer, Arrow, Rect } from "react-konva";
import { Html } from "react-konva-utils";

class RelationCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stroke: 3,
      cornerRadius: 4,
      pointerWidth: 4,
      pointerLength: 2,
      tolFactor: 0.01,
      opacity: 0.8,
    };
  }
  calcPoints = (fromEntId, toEntId) => {
    const fromEnt = this.props.entityDims[fromEntId];
    const toEnt = this.props.entityDims[toEntId];
    const tol = fromEnt.y * this.state.tolFactor;
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

  getColor = (type) => {
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

  drawSEConnections = (connectors) => {
    let connectorArray = connectors.map((c) => {
      return (
        <Arrow
          className={c.type}
          key={connectors.indexOf(c)}
          points={this.calcPoints(c.from, c.to)}
          stroke={this.getColor(c.type)}
          fill={this.getColor(c.type)}
          strokeWidth={this.state.strokeWidth}
          pointerWidth={this.state.pointerWidth}
          pointerLength={this.state.pointerLength}
          tension={0.01}
          opacity={this.state.opacity}
        />
      );
    });
    return { connectorArray };
  };

  circleEntities = (id, entitySet, type) => {
    ///maps sets of entities
    const spacer = 1.001;
    let firstEnt = this.props.entityDims[entitySet[0]];
    let lastEnt = this.props.entityDims[entitySet[entitySet.length - 1]];
    let tol = firstEnt.y * this.state.tolFactor;
    if (firstEnt.y + tol > lastEnt.y) {
      ///first entity in set is not above last entity in set
      let rectWidth = (lastEnt.x + lastEnt.width - firstEnt.x) * spacer;
      return (
        <Rect
          className={type}
          key={"inline " + id}
          stroke={this.getColor(type)}
          strokeWidth={this.state.strokeWidth}
          x={firstEnt.x}
          y={firstEnt.y}
          width={rectWidth}
          height={firstEnt.height * spacer}
          opacity={0.5}
          cornerRadius={this.state.cornerRadius}
        />
      );
    }
    if (firstEnt.y + tol < lastEnt.y) {
      // first entity in set is above last entity in set
      let breakIdx = 0;
      for (let idx of entitySet) {
        if (firstEnt.y + tol > this.props.entityDims[idx].y) {
          breakIdx += 1;
        }
      }
      let breakEnt = this.props.entityDims[entitySet[breakIdx]];
      let secGrpLen = entitySet.length - breakIdx;
      let widthOne = 0;
      let widthTwo = 0;
      for (let ent of this.props.entityDims.slice(
        entitySet[0],
        entitySet[breakIdx]
      )) {
        widthOne += ent.width;
      }
      for (let ent of this.props.entityDims.slice(
        entitySet[breakIdx],
        entitySet[breakIdx] + secGrpLen
      )) {
        widthTwo += ent.width;
      }
      return (
        <React.Fragment key={"fragment " + id}>
          <Rect
            //this one goes from the first ent to the one before
            className={type}
            key={"first " + id}
            stroke={this.getColor(type)}
            strokeWidth={this.state.strokeWidth}
            x={firstEnt.x}
            y={firstEnt.y}
            width={widthOne}
            height={firstEnt.height * spacer}
            opacity={0.5}
            cornerRadius={this.state.cornerRadius}
          />
          <Rect
            //this one goes from the ent corr to breakIdx to the last ent in the grp
            className={type}
            key={"second " + id}
            stroke={this.getColor(type)}
            strokeWidth={this.state.strokeWidth}
            x={breakEnt.x}
            y={breakEnt.y}
            width={widthTwo}
            height={breakEnt.height * spacer}
            opacity={0.5}
            cornerRadius={this.state.cornerRadius}
          />
        </React.Fragment>
      );
    }
    return { entRects };
  };

  drawMEConnections(fromRects, toRects) {
    //connect from the first entity of the fromSet to
    //last entity of toSet
    let meConnectors = fromRects.map((f, id) => {
      let fromProps = null;
      let toProps = null;
      let meId = f.key.match(/\d+/g).map(Number)[0];
      let fromEntId = this.props.multiTokenConnectors[meId]["from"][0];
      let toEntId = this.props.multiTokenConnectors[meId]["to"].slice(-1)[0];
      let reType = this.props.multiTokenConnectors[meId]["type"];
      ///get props of to and from sets
      if (f.type == "Rect") {
        fromProps = f.props;
      } else {
        fromProps = f.props.children[0].props;
      }
      if (toRects[id].type == "Rect") {
        toProps = toRects[id].props;
      } else {
        toProps = toRects[id].props.children[1].props;
      }
      let tol = fromProps.y * this.state.tolFactor;
      return (
        <Arrow
          className={reType}
          key={meId}
          points={this.calcPoints(fromEntId, toEntId)}
          stroke={this.getColor(reType)}
          fill={this.getColor(reType)}
          strokeWidth={this.state.strokeWidth}
          pointerWidth={this.state.pointerWidth}
          pointerLength={this.state.pointerLength}
          tension={0.01}
          opacity={this.state.opacity}
        />
      );
    });
    return { meConnectors };
  }

  render() {
    let connectorArray = this.drawSEConnections(this.props.connectors)[
      "connectorArray"
    ];
    let fromRects = this.props.multiTokenConnectors.map((c) =>
      this.circleEntities(c.id, c.from, c.type)
    );
    let toRects = this.props.multiTokenConnectors.map((c) =>
      this.circleEntities(c.id, c.to, c.type)
    );
    let meConnectors = this.drawMEConnections(fromRects, toRects)[
      "meConnectors"
    ];
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
          {this.props.multiTokenConnectors.length ? fromRects : null}
          {this.props.multiTokenConnectors.length ? toRects : null}
          {meConnectors}
        </Layer>
      </Stage>
    );
  }
}

export default RelationCanvas;

