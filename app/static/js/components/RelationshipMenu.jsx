import React, { Component } from 'react';

class RelationshipMenu extends Component {
    constructor(props){
        super(props)
    }
    state = { relationships : ["Result of", "Product of", "Influenced by", 
    "Characterized by","Has feature", "Used in", "Synonymous with", "Example of", 
    "Jess being so funny"]}

    render() { 
        console.log("Rendered Relationship Menu")
        return ( this.state.relationships.map((rel) => (
            <p>{rel}</p>
        ))
         );
    }
} 
export default RelationshipMenu;
