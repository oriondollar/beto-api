import React, { Component } from "react";

class RelationshipMenu extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    radio: [
      {
        id: "radres",
        value: "re res",
        labelName: "Result of",
        className: "relationship res",
      },
      {
        id: "radprod",
        value: "re prod",
        labelName: "Product of",
        className: "relationship prod",
      },
      {
        id: "radinfl",
        value: "re infl",
        labelName: "Influenced by",
        className: "relationship infl",
      },
      {
        id: "radchar",
        value: "re char",
        labelName: "Characterized by",
        className: "relationship char",
      },
      {
        id: "radfeat",
        value: "re feat",
        labelName: "Has feature",
        className: "relationship feat",
      },
      {
        id: "raduse",
        value: "re use",
        labelName: "Used in",
        className: "relationship use",
      },
      {
        id: "radsyn",
        value: "re syn",
        labelName: "Synonymous with",
        className: "relationship syn",
      },
      {
        id: "radexam",
        value: "re exam",
        labelName: "Example of",
        className: "relationship exam",
      },
    ],
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <div
          className="col-md-6 interactive-menu"
          onChange={this.sendRadioChange}
        >
          {this.state.radio.map((r) => (
            <ul>
              <input
                type="radio"
                id={r.id}
                value={r.value}
                name="relationship"
                onClick={this.sendRadioClick}
              />
              <label className={r.className}> {r.labelName}</label>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
export default RelationshipMenu;

