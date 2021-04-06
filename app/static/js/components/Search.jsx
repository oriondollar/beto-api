import React from 'react';
import Autosuggest from "react-autosuggest";

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSuggestions = (value, dois) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');
  let suggestions = dois.filter(doi => regex.test(doi.name));

  if (suggestions.length === 0) {
    return [];
  } else if (suggestions.length > 5) {
    suggestions = suggestions.slice(0,5)
  }

  return suggestions;
}

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      dois: this.props.dois
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  getSuggestionValue = suggestion => {
    if (suggestion.isAddNew) {
      return this.state.value;
    }

    return suggestion.name;
  };

  renderSuggestion = suggestion => {
    if (suggestion.isAddNew) {
      return (
        <span>
          [+] Add new: <strong>{this.state.value}</strong>
        </span>
      );
    }

    return suggestion.name;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.state.dois)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    if (suggestion.isAddNew) {
      console.log('Add new:', this.state.value);
    }
  };

  handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      this.sendQuery();
    }
  }

  sendQuery = () => {
    this.props.runQuery(this.state.value);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "What you looking for...?",
      value,
      onChange: this.onChange
    };

    return (
      <div className="form" onKeyDown={this.handleKeyDown}>
        <h1 id="betogoogle">
          <span style={{color: "#4285F3"}}>B</span>
          <span style={{color: "#EA4335"}}>E</span>
          <span style={{color: "#FBBD03"}}>T</span>
          <span style={{color: "#34A955"}}>O</span>
        </h1>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
      </div>
    );
  }
}
