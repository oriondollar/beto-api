import React from "react"; 

class Entity extends React.Component {

  sendEntityInfo = () => {
    this.props.getEntityInfo(this.props.id, this.props.type);
  };

  render = () => {
    return (
      <span className={this.props.type} onClick={this.sendEntityInfo}>
        {this.props.text}
      </span>
    );
  };
}

export default Entity;
