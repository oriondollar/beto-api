import React from "react";
import Search from "./Search";

export default class Explore extends React.Component {

  constructor(props) {
    super(props);
    this.sendRel = this.sendRel.bind(this);
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
              "metadata": null},
      classes: {"CI": "CI-button",
		"FR": "FR-button",
		"BioMin": "BioMin-button",
		"zero": "zero-button",
		"one": "one-button",
		"two": "two-button"},
      submitClass: "relevance-submit",
      submitMessage: "",
      catSelect: null,
      relSelect: null
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
    query = query.split('/').join('*')
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

  selRel = (e) => {
    let target_id = e.target.id.split('-');
    let cats = ['CI', 'FR', 'BioMin'];
    let rels = ['zero', 'one', 'two'];
    if (cats.includes(target_id[0])) {
      let catSelect = target_id[0];
      let CIClass;
      let FRClass;
      let BioMinClass;
      if (catSelect == 'CI') {
	CIClass = 'CI-button-selected';
	FRClass = 'FR-button';
	BioMinClass = 'BioMin-button';
      } else if (catSelect == 'FR') {
	CIClass = 'CI-button';
	FRClass = 'FR-button-selected';
	BioMinClass = 'BioMin-button'
      } else if (catSelect == 'BioMin') {
	CIClass = 'CI-button';
	FRClass = 'FR-button';
	BioMinClass = 'BioMin-button-selected';
      }
      this.setState(prevState => {
	let classes = { ...prevState.classes };
	classes.CI = CIClass;
	classes.FR = FRClass;
	classes.BioMin = BioMinClass;
	return { classes };
      });
      this.setState({
	catSelect: catSelect
      });
    } else if (rels.includes(target_id[0])) {
      let relSelect = target_id[0];
      let zeroClass;
      let oneClass;
      let twoClass;
      if (relSelect == 'zero') {
	zeroClass = 'zero-button-selected';
	oneClass = 'one-button';
	twoClass = 'two-button';
      } else if (relSelect == 'one') {
	zeroClass = 'zero-button';
	oneClass = 'one-button-selected';
	twoClass = 'two-button';
      } else if (relSelect == 'two') {
	zeroClass = 'zero-button';
	oneClass = 'one-button';
	twoClass = 'two-button-selected';
      }
      this.setState(prevState => {
	let classes = { ...prevState.classes };
	classes.zero = zeroClass;
	classes.one = oneClass;
	classes.two = twoClass;
	return { classes };
      });
      this.setState({
	relSelect: relSelect
      });
    }
  }

  async sendRel() {
    let doi = this.state.entry.doi;
    let catSelect = this.state.catSelect;
    let relSelect = this.state.relSelect;
    let timeStamp = Date.now()
    let dataPacket = {doi, catSelect, relSelect, timeStamp};
    let response = await fetch('/api/post_classify', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPacket)
    })

    if (response.ok) {
      console.log("response worked!");
      this.setState({
	submitMessage: "submitted!"
      });
    }
  }

  formatSubmit = (e) => {
    if (e.type == 'mousedown') {
      this.setState({submitClass: "relevance-submit-down"});
    } else {
      this.setState({submitClass: "relevance-submit"});
    }
  }

  exitQuery = () => {
    this.setState({
      isSearched: false,
      submitMessage: ""
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
      let field_string = ''
      if (this.state.entry.metadata.Field == null) {
	//pass
      } else {
	this.state.entry.metadata.Field.forEach(field => {
	field_string += `${field}, `
	});
      }
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
      return (<div id="parent">
		<div id="relevance_column">
		  <p className="menu text"><b></b></p>
		  <button id={this.state.classes.CI} onClick={this.selRel} title="Corrosion Inhibitors"/>
		  <button id={this.state.classes.FR} onClick={this.selRel} title="Flame Retardants"/>
		  <button id={this.state.classes.BioMin} onClick={this.selRel} title="Biomineralization"/>
		  <p></p>
		  <button id={this.state.classes.zero} onClick={this.selRel} title="Not Relevant"/>
		  <button id={this.state.classes.one} onClick={this.selRel} title="Somewhat Relevant"/>
		  <button id={this.state.classes.two} onClick={this.selRel} title="Very Relevant"/>
   		  <p></p>
		  <button id={this.state.submitClass} onClick={this.sendRel} onMouseDown={this.formatSubmit} onMouseUp={this.formatSubmit}>Submit</button>
		  <p id="submit-message">{this.state.submitMessage}</p>
		</div>
		<div id="scitext_column">
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
