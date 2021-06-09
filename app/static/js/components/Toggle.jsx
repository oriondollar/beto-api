import React from "react";
import PropTypes from "prop-types";
import "./../../styles/toggle.css";

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function.
The props name, small, disabled and optionLabels are optional.
Usage: <ToggleSwitch id={id} checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitch = ({
  id,
  togname,
  checked,
  onChange,
  handleToggle,
  optionlabels,
  small,
  disabled,
}) => {
  return (
    <div className={"toggle-switch" + (small ? " small-switch" : "")}>
      <input
        type="checkbox"
        togname={togname}
        className="toggle-switch-checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        optionlabels={optionlabels}
      />
      {id ? (
        <label
          className="toggle-switch-label"
          htmlFor={id}
          tabIndex={disabled ? -1 : 1}
          onKeyDown={handleToggle}
        >
          <span
            className={
              disabled
                ? "toggle-switch-inner toggle-switch-disabled"
                : "toggle-switch-inner"
            }
            data-yes={optionlabels[0]}
            data-no={optionlabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              disabled
                ? "toggle-switch-switch toggle-switch-disabled"
                : "toggle-switch-switch"
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

// Set optionlabels for rendering.
ToggleSwitch.defaultProps = {
  optionlabels: ["Yes", "No"],
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  // checked: PropTypes.bool.isRequired,
  // onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  optionlabels: PropTypes.array,
  small: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ToggleSwitch;

