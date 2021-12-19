import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";

const path = window.location.pathname
const lastIndexSlash = path.lastIndexOf('/')
const cutLastPart = (path.substring(0, lastIndexSlash))

const isLipnonet = cutLastPart.search('lipnonet') !== -1
console.log(isLipnonet)
const origPathWithoutLipnonet = isLipnonet ? cutLastPart.replace('/lipnonet', '') : cutLastPart

let replace: string
replace = origPathWithoutLipnonet.replace('/frymburk', '')
replace = replace.replace('/lipno', '')
replace = replace.replace('/oldStation', '')

replace = isLipnonet ? '/lipnonet' + replace : replace

console.log(window.location.origin)
console.log(path + ' -> ' + cutLastPart  + ' -> ' + replace)


ReactDOM.render(
<React.StrictMode>
  <Router basename={replace}>
    <App />
  </Router>
</React.StrictMode>,
document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
