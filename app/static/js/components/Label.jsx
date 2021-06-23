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
      id: "annotation-mode",
      togname: "test",
      checked: false,
      small: false,
      disabled: false,
      optionlabels: ["Label", "Link"],
      entityDims: [],
    };
    this.entityRef = React.createRef();
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
    this.setState({
      selectedEntityID: id,
      selectedEntityCategory: category,
    });
  };

  getRadioInfo = (value) => {
    let entities = this.state.entities;
    if (this.state.selectedEntityID !== null) {
      entities[this.state.selectedEntityID][0] = value;
    }
    this.setState({
      entities: entities,
      selectedEntityCategory: value,
    });
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
            ref={this.entityRef}
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
        onMouseUp={this.createNewEntity}
      >
        {JSXArray}
      </p>
    );
  };

  genEntityDims = () => {
     let elements = document.getElementsByClassName("entity");
     console.log(elements);
     
     var arr =  Array.prototype.map.call(elements, element =>
         element.getBoundingClientRect())
     console.log(arr
     );
    // Array.from(elements).forEach((element) => {
    //   console.log(elements[element].getBoundingClientRect());
    // });
  };

  changeChecked = () => {
    this.setState({ checked: !this.state.checked });
  };

  renderMenu() {
    const isChecked = this.state.checked;
    if (isChecked) {
      return <LabelMenu getRadioInfo={this.getRadioInfo} />;
    }
    return <RelationshipMenu />;
  }

  renderCanvas = () => {
    const isChecked = this.state.checked;
    if (!isChecked) {
      return <RelationCanvas />;
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
      this.genEntityDims(); 
      return (
        <div className="bgimg-1">
          <div id="parent" onKeyDown={this.handleKeyDown} tabIndex="0">
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-md-10 sci-text">
                <h4 className="title">
                  <b>{title}</b>
                </h4>
                <p
                  ref={this.mySciTextRef}
                  className="doi"
                  onLoadedData={this.getSciTextDims}
                >
                  <em>doi:{doi}</em>
                </p>
                <RelationCanvas text={abstractJSX} />
                <Toggle
                  togname={togname}
                  id={id}
                  small={small}
                  disabled={disabled}
                  checked={checked}
                  onChange={this.changeChecked}
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

