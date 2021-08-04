import React from "react";
import Entity from "./Entity";
import LabelMenu from "./LabelMenu";
import RelationshipMenu from "./RelationshipMenu";
import RelationCanvas from "./RelationCanvas";
import Toggle from "./Toggle";

export default class Label extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmitEnts = this.handleSubmitEnts.bind(this);
    this.handleSubmitRels = this.handleSubmitRels.bind(this);
    this.handleAnother = this.handleAnother.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      title: null,
      doi: null,
      text: null,
      entities: null,
      selectedEntityID: null,
      selectedEntityCategory: "entity chem",
      vrelDOIs: null,
      checked: true,
      entityDims: [],
      abstractDim: [],
      selectedReCategory: "re prod",
      connectors: [],
      fromEntityId: null,
      hasFromEntityId: false,
      multiToken: false,
      entitySet: [],
      fromSet: [],
      hasFromSet: false,
      subLabels: false,
      subRels: false,
      multiTokenConnectors: [],
      submitWarning: "",
    };
  }

  componentDidMount() {
    console.log("we really made it!");
    Promise.all([fetch("/api/rand/"), fetch("/api/vrel_dois/")])
      .then(([res1, res2]) => {
        return Promise.all([res1.json(), res2.json()]);
      })
      .then(
        ([res1, res2]) => {
          this.setState({
            isLoaded: true,
            title: res1.content.title,
            doi: res1.content.doi,
            text: res1.content.text,
            entities: res1.content.entities,
            vrelDOIs: res2.content.dois,
          });
        },

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
    if (this.state.selectedEntityID !== null && this.state.checked) {
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
    if (!this.state.checked) {
      if (e.keyCode === 8) {
        if (!this.state.multiToken) {
          let newConnectors = [...this.state.connectors];
          newConnectors.pop();
          this.setState({
            connectors: newConnectors,
            multiToken: false,
          });
        } else {
          let newMEConnectors = [...this.state.multiTokenConnectors];
          newMEConnectors.pop();
          this.setState({ multiTokenConnectors: newMEConnectors });
        }
      }
      if (e.keyCode === 49) {
        this.setState({ multiToken: true });
      }
      if (e.keyCode === 50) {
        this.setState({
          hasFromSet: true,
          fromSet: this.state.entitySet,
          entitySet: [],
        });
      }
      if (e.keyCode === 13) {
        let newConnector = {
          id: this.state.multiTokenConnectors.length,
          from: this.state.fromSet,
          to: this.state.entitySet,
          type: this.state.selectedReCategory,
        };
        this.setState({
          multiToken: false,
          hasFromSet: false,
          multiTokenConnectors: this.state.multiTokenConnectors.concat([
            newConnector,
          ]),
        });
      }
      if (e.keyCode === 27) {
        this.setState({
          multiToken: false,
          entitySet: [],
          fromSet: [],
          hasFromSet: false,
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
  };

  createRel = (id) => {
    const {
      hasFromEntityId,
      fromEntityId,
      connectors,
      selectedReCategory,
      multiToken,
      entitySet,
    } = this.state;
    this.setState({ selectedEntityID: id });
    if (!multiToken) {
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
              c.from == fromEntityId &&
              c.to == id &&
              c.type == selectedReCategory
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
          selectedEntityID: null,
        });
      }
    }
    if (multiToken) {
      let newSet = [...entitySet].concat([id]);
      this.setState({ entitySet: [...new Set(newSet)].sort() });
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
        return <span className={type}>{text}</span>;
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

  async handleSubmitEnts() {
    let { doi, entities, text } = this.state;
    let timeStamp = Date.now();
    let types = Array.prototype.map.call(entities, (e) => e[0]);
    let startSpans = Array.prototype.map.call(entities, (e) => e[1]);
    let endSpans = Array.prototype.map.call(entities, (e) => e[2]);
    let surfaceForm = Array.prototype.map.call(entities, (e) =>
      text.slice(e[1], e[2])
    );
    let dataPacket = {
      doi,
      types,
      startSpans,
      endSpans,
      surfaceForm,
      timeStamp,
    };
    let response = await fetch("/api/post_entities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPacket),
    });
    if (response.ok) {
      this.setState({ subLabels: true, submitWarning: "" });
      {
        this.handleToggle();
      }
    }
    ///can do stuff like indicate temp that entities were submitted.
  }

  async handleSubmitRels() {
    if (this.state.subLabels) {
      let { doi, connectors, multiTokenConnectors } = this.state;
      let timeStamp = Date.now();
      let dataPacket = { doi, connectors, multiTokenConnectors, timeStamp };
      let response = await fetch("/api/post_relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPacket),
      });

      if (response.ok) {
        this.setState({ subRels: true, submitWarning: "" });
      }
      //can do stuff to indicate temp that rel were submitted
    } else {
      //stylize to show in
      this.setState({ submitWarning: "Gotta submit labels first!" });
    }
  }

  async handleAnother() {
    if (this.state.subLabels && this.state.subRels) {
      let vrelDOIs = this.state.vrelDOIs;
      let randDOI = vrelDOIs[Math.floor(Math.random() * vrelDOIs.length)];
      vrelDOIs.splice(vrelDOIs.indexOf(randDOI), 1);
      let query = randDOI.split("/").join("*");
      fetch(`/api/${query}`)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            doi: result.content.doi,
            title: result.content.title,
            text: result.content.abstract,
            entities: [],
            vrelDOIs: vrelDOIs,
            connectors: [],
            multiTokenConnectors: [],
            checked: true,
            vrelDOIs: vrelDOIs,
            subLabels: false,
            subRels: false,
            submitWarning: "",
          });
        });
      ///when setting state filter the randDoi
    } else if (this.state.subLabels && !this.state.subRels) {
      this.setState({ submitWarning: "Submit relations first!" });
    }
  }
  renderMenu() {
    const isChecked = this.state.checked;
    if (isChecked) {
      return (
        <LabelMenu
          getRadioInfo={this.getRadioInfo}
          handleSubmit={this.handleSubmitEnts}
        />
      );
    }
    return (
      <RelationshipMenu
        getRadioInfo={this.getRadioInfo}
        multiTokenConnectors={this.state.multiTokenConnectors}
        handleSubmit={this.handleSubmitRels}
        handleAnother={this.handleAnother}
        submitWarning={this.state.submitWarning}
      />
    );
  }

  renderCanvas = (text, connectors) => {
    const { checked, abstractDim, entityDims, multiTokenConnectors } =
      this.state;
    if (!checked) {
      return (
        <RelationCanvas
          text={text}
          abDim={abstractDim}
          connectors={connectors}
          entityDims={entityDims}
          multiTokenConnectors={multiTokenConnectors}
        />
      );
    } else {
      return text;
    }
  };

  render() {
    const { error, isLoaded, title, doi, checked } = this.state;
    let { connectors, multiTokenConnectors, entities } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let abstractJSX = this.genAbstractJSX(this.genSpanList());
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
                {this.renderCanvas(
                  abstractJSX,
                  connectors,
                  multiTokenConnectors
                )}
                <Toggle
                  togname="mode-switcher"
                  key="toggle"
                  id="toggle"
                  small={false}
                  disabled={this.state.subLabels ? true : false}
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

