import React from 'react';
import PropTypes from 'prop-types';

class LabelMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    }
  }

  sendRadioChange = (e) => {
    this.props.getRadioInfo(e.target.value);
    this.setState({
      selected: e.target.value
    })
  }

  sendRadioClick = (e) => {
    if (this.state.selected == e.target.value) {
      this.props.getRadioInfo(e.target.value)
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-1">
        </div>
        <div className="col-md-6 interactive-menu" onChange={this.sendRadioChange}>
        <ul>
          <ul>
            <input type="radio" id="radcpt" value="entity cpt" name="category" onClick={this.sendRadioClick}/>
              <label htmlFor="radcpt" className="category cpt">Concept</label>
          </ul>
          <ul>
              <input type="radio" id="radmol" value="entity mol" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="radmol" className="category mol">Molecule</label>
          </ul>
          <ul>
              <input type="radio" id="radpro" value="entity pro" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="radpro" className="category pro">Property</label>
          </ul>
          <ul>
              <input type="radio" id="radcmt" value="entity cmt" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="radcmt" className="category cmt">Characterization Method</label>
          </ul>
          <ul>
              <input type="radio" id="radsmt" value="entity smt" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="radsmt" className="category smt">Synthesis Method</label>
          </ul>
          <ul>
              <input type="radio" id="radequip" value="entity equip" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="radequip" className="category equip">Experimental Equipment</label>
          </ul>
          <ul>
              <input type="radio" id="raddsc" value="entity dsc" name="category" onClick={this.sendRadioClick}/>
                <label htmlFor="raddsc" className="category dsc">Descriptor</label>
          </ul>
        </ul>
        </div>
        <div className="col-md-4 submit-labels">
          <a className="btn btn-primary apple-button" href="{{ url_for('home') }}" role="button">Submit Labels</a>
        </div>
        <div className="col-md-1">
        </div>
      </div>
    )
  }

}

export default LabelMenu;
