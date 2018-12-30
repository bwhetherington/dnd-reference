import React from 'react';
import Markdown from './Markdown';
import queryString from 'query-string';
import './App.css';

function App(props) {
  const search = window.location.search;
  const { url } = queryString.parse(search);

  if (typeof url === 'string') {
    return <div className="page"><Markdown url={url} /></div>;
  } else {
    return <div className="page"><div className="error">Please enter a valid URL</div></div>;
  }
}

export default App;