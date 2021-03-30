import React from 'react';
import PropTypes from 'prop-types';

class Entity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      text: this.props.text,
      type: this.props.type,
      styleSelected: {
        padding: '.05em .15em',
        fontWeight: 'bold'
      },
      styleNotSelected: {
        padding: '.01em .1em',
        fontWeight: 'normal'
      }
    };
  }

  componentWillReceiveProps({type, text}) {
    this.setState({
      type: type,
      text: text
    })
  }

  sendEntityInfo = () => {
    this.props.getEntityInfo(this.props.id, this.props.type);
  }

  render() {
    let {id, type, styleSelected, styleNotSelected, text} = this.state
    return <span className={type} onClick={this.sendEntityInfo}>{text}</span>
  }
}

Entity.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Entity;
