import React from "react";
import Entity from "./Entity";
import LabelMenu from "./LabelMenu";
import RelationshipMenu from "./RelationshipMenu";
import RelationCanvas from "./RelationCanvas";
import Toggle from "./Toggle";
import { Html } from "react-konva-utils";
import { Stage, Layer } from "react-konva";

export default class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      title: null,
      doi: null,
      text: null,
      entities: null,
      selectedEntityID: null,
      selectedEntityCategory: "entity cpt",
      id: "annotation-mode",
      togname: "test",
      checked: true,
      small: false,
      disabled: false,
      optionlabels: ["Label", "Link"],
      entityDims: [],
      abstractDim: [],
      selectedReCategory: "re prod",
      connectors: [
        {
          from: 0,
          to: 6,
          type: "re prod",
          id: 0,
        },
      ],
      fromEntityId: null,
    };
  }

  componentDidMount() {
    console.log("we really made it!");
    fetch("/api/rand/")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            title: result.content.title,
            doi: result.content.doi,
            text: result.content.text,
            entities: result.content.entities,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components

        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  getEntityInfo = (id, category) => {
    console.log("getEntityInfo", id, category);
    this.setState({
      selectedEntityID: id,
      selectedEntityCategory: category,
    });
  };

  getRadioInfo = (value) => {
    const isChecked = this.state.checked;
    if (isChecked) {
      let entities = this.state.entities;
      if (this.state.selectedEntityID !== null) {
        entities[this.state.selectedEntityID][0] = value;
      }
      this.setState({
        entities: entities,
        selectedEntityCategory: value,
      });
    } else {
      this.setState({ selectedReCategory: value });
    }
  };

  handleKeyDown = (e) => {
    if (this.state.selectedEntityID !== null) {
      if (e.keyCode === 37) {
        let newID = this.state.selectedEntityID - 1;
        if (newID < 0) {
          newID = this.state.entities.length - 1;
        }
        this.setState({
          selectedEntityID: newID,
        });
      } else if (e.keyCode === 39) {
        let newID = this.state.selectedEntityID + 1;
        if (newID >= this.state.entities.length) {
          newID = 0;
        }
        this.setState({
          selectedEntityID: newID,
        });
      } else if (e.keyCode === 8) {
        let newEntities = this.state.entities.filter(
          (val, idx) => this.state.selectedEntityID !== idx
        );
        this.setState({
          entities: newEntities,
        });
      }
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  createNewEntity = (e) => {
    const isChecked = this.state.checked;
    if (e.target.tagName != "SPAN" && isChecked) {
      const selectionObj = window.getSelection && window.getSelection();
      let startHighlightSpan = selectionObj.anchorOffset;
      let endHighlightSpan = selectionObj.focusOffset;
      let text = selectionObj.focusNode.data;
      let highlightText = text.slice(startHighlightSpan, endHighlightSpan);
      let startSpan = this.state.text.indexOf(text) + startHighlightSpan;
      let endSpan = startSpan + highlightText.length;
      let insertIdx = 0;
      for (let [type, start, stop] of this.state.entities) {
        if (startSpan < start) {
          break;
        } else {
          insertIdx += 1;
        }
      }
      let newEntities = this.state.entities.slice(0, insertIdx);
      newEntities.push([this.state.selectedEntityCategory, startSpan, endSpan]);
      this.state.entities
        .slice(insertIdx)
        .forEach((item) => newEntities.push(item));
      this.setState({
        entities: newEntities,
        selectedEntityID: insertIdx,
      });
    }
    console.log(this.state.entities);
  };

  genSpanList() {
    let entities = this.state.entities;
    let text = this.state.text;
    let spanList = [];
    let prevStartSpan = 0;
    let startSpan;
    let endSpan;
    entities.forEach((element, id) => {
      startSpan = element[1];
      endSpan = element[2];
      spanList.push([null, text.slice(prevStartSpan, startSpan), "para"]);
      spanList.push([id, text.slice(startSpan, endSpan), element[0]]);
      prevStartSpan = endSpan;
    });
    spanList.push([null, text.slice(prevStartSpan), "para"]);

    return spanList;
  }

  createNewConnector = () => {
    let { connectors, fromEntityId, selectedReCategory, selectedEntityID } =
      this.state;
    if (fromEntityId) {
      let newConnector = {
        id: connectors.length,
        from: fromEntityId,
        to: selectedEntityID,
        type: selectedReCategory,
      };
      console.log("new connector", newConnector);
      console.log("current connectors", connectors);
      this.setState({ connectors: connectors.concat([newConnector]) });
      this.setState({ fromEntityId: null });
    } else {
      this.setState({ fromEntityId: selectedEntityID });
    }
  };

  genConnectors = () => {
    var connectors = this.state.connectors;
    console.log("in genConnectors", connectors);
    return connectors;
  };

  genAbstractJSX = (spanList) => {
    const isChecked = this.state.checked;
    let JSXArray = spanList.map(([id, text, type]) => {
      if (type == "para" && isChecked) {
        return text;
      } else if (type == "para" && !isChecked) {
        type += " relation";
        return <span className={type}> {text} </span>;
      } else {
        if (id == this.state.selectedEntityID) {
          type += " selected";
        }
        if (!isChecked) {
          type += " relation";
        }
        return (
          <Entity
            key={id}
            id={id}
            type={type}
            text={text}
            getEntityInfo={this.getEntityInfo}
          />
        );
      }
    });
    return (
      <p
        className={isChecked ? "abstract" : "abstract relation"}
        onMouseUp={isChecked ? this.createNewEntity : this.createNewConnector}
      >
        {JSXArray}
      </p>
    );
  };

  handleToggle = () => {
    let elements = document.getElementsByClassName("entity");
    let abstract = document.getElementsByClassName("abstract");
    console.log(elements);
    var entityDims = Array.prototype.map.call(elements, (element) =>
      element.getBoundingClientRect()
    );
    let abstractDim = Array.prototype.map.call(abstract, (ab) =>
      ab.getBoundingClientRect()
    );
    (abstractDim = {
      offsetX: abstractDim[0].x,
      offsetY: abstractDim[0].y,
      height: abstractDim[0].height,
      width: abstractDim[0].width,
    }),
      this.setState({
        checked: !this.state.checked,
        entityDims: entityDims,
        abstractDim: abstractDim,
      });
  };

  renderMenu() {
    const isChecked = this.state.checked;
    if (isChecked) {
      return <LabelMenu getRadioInfo={this.getRadioInfo} />;
    }
    return <RelationshipMenu getRadioInfo={this.getRadioInfo} />;
  }

  renderCanvas = (text, connectors) => {
    const { checked, abstractDim, entityDims } = this.state;
    if (!checked) {
      return (
        <RelationCanvas
          text={text}
          abDim={abstractDim}
          connectors={connectors}
          entityDims={entityDims}
        />
      );
    } else {
      return text;
    }
  };

  render() {
    const {
      error,
      isLoaded,
      title,
      doi,
      text,
      entities,
      togname,
      id,
      small,
      disabled,
      checked,
      optionlabels,
    } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let abstractJSX = this.genAbstractJSX(this.genSpanList());
      let connectors = this.genConnectors();
      return (
        <div className="bgimg-1">
          <div id="parent" onKeyDown={this.handleKeyDown} tabIndex="0">
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-md-10 sci-text">
                <h4 className="title">
                  <b>{title}</b>
                </h4>
                <p className="doi">
                  <em>doi:{doi}</em>
                </p>
                {this.renderCanvas(abstractJSX, connectors)}
                <Toggle
                  togname={togname}
                  id={id}
                  small={small}
                  disabled={disabled}
                  checked={checked}
                  onChange={this.handleToggle}
                  optionlabels={optionlabels}
                />
              </div>
              <div className="col-sm-1"></div>
            </div>
            {this.renderMenu()};
          </div>
        </div>
      );
    }
  }
}

