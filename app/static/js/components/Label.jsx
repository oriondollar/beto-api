import React from "react";
import Entity from "./Entity";
import LabelMenu from "./LabelMenu";
import RelationshipMenu from "./RelationshipMenu";
import RelationCanvas from "./RelationCanvas";
import Toggle from "./Toggle";

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
      checked: true,
      entityDims: [],
      abstractDim: [],
      selectedReCategory: "re prod",
      connectors: [],
      fromEntityId: null,
      hasFromEntityId: false,
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

  setEntityInfo = (id, category) => {
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
      let connectors = this.state.connectors;
      if (connectors.length > 0) {
        connectors[connectors.length - 1]["type"] = value;
        this.setState({ connectors: connectors });
      }
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
    console.log("createNewEntity");
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
  };

  createRel = (id) => {
    const { hasFromEntityId, fromEntityId, connectors, selectedReCategory } =
      this.state;
    if (!hasFromEntityId) {
      this.setState({
        fromEntityId: id,
        hasFromEntityId: true,
      });
    }
    if (hasFromEntityId) {
      let connectorMatch = connectors.filter(
        (c) =>
          c.from == fromEntityId && c.to == id && c.type == selectedReCategory
      );
      if (connectorMatch.length > 0) {
        let filtConnectors = [...connectors];
        let idx = connectors.findIndex(
          (c) =>
            c.from == fromEntityId && c.to == id && c.type == selectedReCategory
        );
        filtConnectors.splice(idx, 1);
        this.setState({ connectors: filtConnectors });
      } else {
        let newConnector = {
          id: connectors.length,
          from: fromEntityId,
          to: id,
          type: selectedReCategory,
        };
        this.setState({
          connectors: connectors.concat([newConnector]),
        });
      }
      this.setState({
        hasFromEntityId: false,
        hasToEntityId: false,
        fromEntityId: null,
      });
    }
  };

  genSpanList() {
    let { entities, text } = this.state; 
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

  genAbstractJSX = (spanList) => {
    const isChecked = this.state.checked;
    let JSXArray = spanList.map(([id, text, type]) => {
      if (type == "para" && isChecked) {
        return text;
      } else if (type == "para" && !isChecked) {
        type += " relation";
        return <text className={type}>{text}</text>;
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
            setEntityInfo={isChecked ? this.setEntityInfo : this.createRel}
          />
        );
      }
    });
    return (
      <p
        className={isChecked ? "abstract" : "abstract relation"}
        onMouseUp={isChecked ? this.createNewEntity : null}
      >
        {JSXArray}
      </p>
    );
  };

  handleToggle = () => {
    let elements = document.getElementsByClassName("entity");
    let abstract = document.getElementsByClassName("abstract");
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
        hasFromEntityId: false,
        hasToEntityId: false,
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
    const { error, isLoaded, title, doi, checked } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let abstractJSX = this.genAbstractJSX(this.genSpanList());
      let connectors = this.state.connectors;
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
                  togname="mode-switcher"
                  id="toggle"
                  small={false}
                  disabled={false}
                  checked={checked}
                  onChange={this.handleToggle}
                  optionlabels={["Label", "Link"]}
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

