import React from 'react';
import Markdown from './Markdown';
import queryString from 'query-string';

import paladin from '../markdown/paladin.md';
import './App.css';

function App(props) {
  const search = window.location.search;
  const { url } = queryString.parse(search);
  if (typeof url === 'string') {
    return <Markdown url={url} />;
  } else {
    return <div className="error">Please enter a valid URL</div>
  }
}

export default App;