import React from "react";
import ReactDOM from "react-dom";
import Label from "./components/Label";
import Explore from "./components/Explore"

let url_comps = window.location.href.split("/");
let page_index = url_comps[url_comps.length-1];

if (page_index == 'label') {
  ReactDOM.render(<Label />, document.getElementById("content"));
} else if (page_index == 'explore') {
  ReactDOM.render(<Explore />, document.getElementById("content"));
}
