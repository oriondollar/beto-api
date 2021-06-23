import React from "react";
import PropTypes from "prop-types";

class Entity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      text: this.props.text,
      type: this.props.type,
      entityDims: [],
      styleSelected: {
        padding: ".05em .15em",
        fontWeight: "bold",
      },
      styleNotSelected: {
        padding: ".01em .1em",
        fontWeight: "normal",
      },
    };
    this.entityRef = React.createRef();
  }

  componentDidMount() {
 //   this.getEntityDims();
  }

  componentWillReceiveProps({ type, text }) {
    this.setState({
      type: type,
      text: text,
    });
  }

  sendEntityInfo = () => {
    this.props.getEntityInfo(this.props.id, this.props.type);
  };

  getEntityDims = () => {
    console.log(this.entityRef.current.getBoundingClientRect());
  };

  render = () => {
    let { id, type, styleSelected, styleNotSelected, text } = this.state;
    return (
      <span ref={this.entityRef} className={type} onClick={this.sendEntityInfo}>
        {text}
      </span>
    );
  };
}

Entity.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

//export default React.forwardRef((props,ref) => <Entity entityRef={ref}/>);
//export default Entity;
export default React.forwardRef((props, ref) => (
  <Entity entityRef={ref} {...props} />
));

