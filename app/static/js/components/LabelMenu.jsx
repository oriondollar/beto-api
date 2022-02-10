import React, { Component } from "react";

class LabelMenu extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    radio: [
      {
        id: "radchem",
        value: "entity chem",
        labelName: "Chemical",
        className: "category chem",
      },
      {
        id: "radcdsc",
        value: "entity cdsc",
        labelName: "Chemical Descriptor",
        className: "category cdsc",
      },
      {
        id: "radsmt",
        value: "entity smt",
        labelName: "Synthesis Method",
        className: "category smt",
      },
      // {
      //   id: "radsdsc",
      //   value: "entity sdsc",
      //   labelName: "Synthesis Descriptor",
      //   className: "category sdsc",
      // },
      {
        id: "radcmt",
        value: "entity cmt",
        labelName: "Characterization Method",
        className: "category cmt",
      },
      // {
      //   id: "radctdsc",
      //   value: "entity ctdsc",
      //   labelName: "Characterization Descriptor",
      //   className: "category ctdsc",
      // },
      {
        id: "radcres",
        value: "entity cres",
        labelName: "Characterization Result",
        className: "category cres",
      },
      {
        id: "radprop",
        value: "entity prop",
        labelName: "Property",
        className: "category prop",
      },
      {
        id: "radpdsc",
        value: "entity pdsc",
        labelName: "Property Descriptor",
        className: "category pdsc",
      },

      {
        id: "radmtrc",
        value: "entity mtrc",
        labelName: "Metric",
        className: "category mtrc",
      },
      {
        id: "radapp",
        value: "entity app",
        labelName: "Application Area",
        className: "category app",
      },
      {
        id: "radequip",
        value: "entity equip",
        labelName: "Experimental Equipment",
        className: "category equip",
      },
    ],
  };

  sendRadioChange = (e) => {
    this.props.getRadioInfo(e.target.value);
    this.setState({
      selected: e.target.value,
    });
  };

  sendRadioClick = (e) => {
    if (this.state.selected == e.target.value) {
      this.props.getRadioInfo(e.target.value);
    }
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <div
          className="col-md-6 interactive-menu"
          onChange={this.sendRadioChange}
        >
          <ul>
            {this.state.radio.map((r) => (
              <ul key={r.id}>
                <input
                  key={r.id}
                  type="radio"
                  id={r.id}
                  value={r.value}
                  name="category"
                  onClick={this.sendRadioClick}
                />
                <label htmlFor={r.id} className={r.className}>
                  {r.labelName}
                </label>
              </ul>
            ))}
          </ul>
        </div>
        <div className="col-md-4 submit-labels">
          <a
            className="btn btn-primary apple-button"
            onClick={handleSubmit}
            role="button"
          >
            Submit Labels
          </a>
        </div>
        <div className="col-md-1"></div>
      </div>
    );
  }
}
export default LabelMenu;

