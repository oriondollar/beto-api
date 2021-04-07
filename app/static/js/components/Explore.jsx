import React from "react";
import Search from "./Search";

export default class Explore extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      isSearched: false,
      doi_suggestions: null,
      entry: {"title": null,
              "doi": null,
              "abstract": null,
              "fulltext": null,
              "keywords": null,
              "metadata": null}
    };
  }

  componentDidMount() {
    fetch("/api/doi_suggestions/")
      .then(res => res.json())
      .then(
        (result) => {
          let dois = []
          result.content.dois.forEach(item => dois.push({name: item}));
          this.setState({
            isLoaded: true,
            doi_suggestions: dois
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

  runQuery = (query) => {
    query = query.replace('/', '_')
    fetch(`/api/${query}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState(prevState => {
            let entry = { ...prevState.entry };
            entry.title = result.content.title;
            entry.doi = result.content.doi;
            entry.abstract = result.content.abstract;
            entry.fulltext = result.content.fulltext;
            entry.keywords = result.content.keywords;
            entry.metadata = result.content.metadata;
            return { entry };
          });
          this.setState({
            isSearched: true
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  exitQuery = () => {
    this.setState({
      isSearched: false
    })
  }

  randQuery = () => {
    let randDOI = this.state.doi_suggestions[Math.floor(Math.random() * this.state.doi_suggestions.length)].name;
    this.runQuery(randDOI);
  }

  genExploreJSX = () => {
    if (this.state.isSearched) {
      let author_string = '';
      this.state.entry.metadata.Authors.forEach(author => {
        author_string += `${author.first} ${author.last}, `;
      });
      author_string = author_string.slice(0, -2);
      let field_string = '';
      this.state.entry.metadata.Field.forEach(field => {
        field_string += `${field}, `
      });
      field_string = field_string.slice(0, -2);
      let keyword_string = '';
      this.state.entry.keywords.forEach(keyword => {
        keyword_string += `${keyword}, `
      });
      keyword_string = keyword_string.slice(0, -2);
      let text_body = this.state.entry.fulltext.Body
      let bodyArray = [];
      if (text_body.length > 0) {
        let body_sections = {};
        let section_order = [];
        text_body.forEach(para => {
          let section = para.section;
          let text = para.text;
          if (section in body_sections) {
            body_sections[section] += para.text
          } else if (!(section in body_sections)) {
            body_sections[section] = para.text;
            section_order.push(section);
          }
          });
        section_order.forEach(section => {
          let section_header = <h2>{section}</h2>;
          let section_text = <p className="text">{ body_sections[section] }</p>;
          bodyArray.push(section_header);
          bodyArray.push(section_text);
        });
      }
      console.log(bodyArray);
      return (<div id="parent">
                <button className="xout" onClick={this.exitQuery}>X</button>
                <h4 className="title" style={{textAlign: "center"}}><b>{this.state.entry.title}</b></h4>
                <div className="meta">
                  <p><em>{this.state.entry.metadata.JournalName} ({this.state.entry.metadata.PubYear})</em></p>
                  <p><em>Authors: {author_string}</em></p>
                  <p><em>Fields: {field_string}</em></p>
                  <p><em>Keywords: {keyword_string}</em></p>
                  <p><em>doi:{this.state.entry.doi}</em></p>
                </div>
                <p className="text">{this.state.entry.abstract}</p>
                <p style={{textAlign: "center", fontSize: "90px"}}>-</p>
                <div className="fulltext">{ bodyArray }</div>
              </div>
            );
    } else if (!this.state.isSearched) {
      return (
          <div id="parent">
            <Search dois={this.state.doi_suggestions} runQuery={this.runQuery}/>
            <div id="lucky-div">
              <button className="lucky-button" onClick={this.randQuery}>Feeling Lucky?</button>
            </div>
          </div>
      )
    }
  }

  render() {
    const { error, isLoaded, title, doi, text, entities } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let exploreJSX = this.genExploreJSX();
      return (
        <div id="parent">
          <div className="row">
            <div className="col-sm-1">
            </div>
            <div className="col-md-10 sci-text">
              {exploreJSX}
            </div>
            <div className="col-sm-1">
            </div>
          </div>
        </div>
      );
    }
  }
}
