import React from "react";
import Entity from "./Entity";
import LabelMenu from "./LabelMenu";
import RelationshipMenu from "./RelationshipMenu";

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
      selectedEntityCategory: 'entity cpt',
      menuType: 'label'
    };
  }

  componentDidMount() {
    console.log('we really made it!')
    fetch("/api/rand/")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            title: result.content.title,
            doi: result.content.doi,
            text: result.content.text,
            entities: result.content.entities
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  getEntityInfo = (id, category) => {
    this.setState({
      selectedEntityID: id,
      selectedEntityCategory: category
    });
  }

  getRadioInfo = (value) => {
    let entities = this.state.entities;
    if (this.state.selectedEntityID !== null) {
      entities[this.state.selectedEntityID][0] = value;
    }
    this.setState({
      entities: entities,
      selectedEntityCategory: value
    })
  }

  handleKeyDown = (e) => {
    if (this.state.selectedEntityID !== null) {
      if (e.keyCode === 37) {
        let newID = this.state.selectedEntityID - 1
        if (newID < 0) {
          newID = this.state.entities.length - 1
        }
        this.setState({
          selectedEntityID: newID
        })
      } else if (e.keyCode === 39) {
        let newID = this.state.selectedEntityID + 1
        if (newID >= this.state.entities.length) {
          newID = 0
        }
        this.setState({
          selectedEntityID: newID
        })
      } else if (e.keyCode === 8) {
        let newEntities = this.state.entities.filter((val, idx) => this.state.selectedEntityID !== idx);
        this.setState({
          entities: newEntities
        })
      }
    }
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  }

  createNewEntity = (e) => {
    if (e.target.tagName != 'SPAN') {
      const selectionObj = (window.getSelection && window.getSelection());
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
          insertIdx += 1
        }
      }
      let newEntities = this.state.entities.slice(0, insertIdx);
      newEntities.push([this.state.selectedEntityCategory, startSpan, endSpan]);
      this.state.entities.slice(insertIdx).forEach(item => newEntities.push(item));
      this.setState({
        entities: newEntities,
        selectedEntityID: insertIdx
      })
    }
  }

  genSpanList() {
    let entities = this.state.entities;
    let text = this.state.text;
    let spanList = []

    let prevStartSpan = 0
    let startSpan;
    let endSpan;
    entities.forEach((element, id) => {
      startSpan = element[1];
      endSpan = element[2];
      spanList.push([null, text.slice(prevStartSpan, startSpan), 'para']);
      spanList.push([id, text.slice(startSpan, endSpan), element[0]]);
      prevStartSpan = endSpan;
    });
    spanList.push([null, text.slice(prevStartSpan), 'para'])

    return spanList;
  }

  genAbstractJSX = (spanList) => {
    let JSXArray = spanList.map(([id, text, type]) => {
      if (type == 'para') {
        return text
      } else {
        if (id == this.state.selectedEntityID) {
          type += ' selected'
        }
        return <Entity key={id} id={id} type={type} text={text} getEntityInfo={this.getEntityInfo}/>
      }
    });
    return <p className="abstract" onMouseUp={this.createNewEntity}>{ JSXArray }</p>
  }

  renderMenu() {
    if (this.state.menuType === 'label') return <LabelMenu getRadioInfo={this.getRadioInfo}/>;
    return <RelationshipMenu/>;  
  }

  render() {
    const { error, isLoaded, title, doi, text, entities } = this.state;
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
              <div className="col-sm-1">
              </div>
              <div className="col-md-10 sci-text">
                <h4 className="title"><b>{title}</b></h4>
                <p className="doi"><em>doi:{doi}</em></p>
                {abstractJSX}
              </div>
              <div className="col-sm-1">
              </div>
            </div>
	    { this.renderMenu() } 
          </div>
        </div>
      );
    }
  }
}
