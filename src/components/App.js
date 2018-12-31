import React from 'react';
import Markdown from './Markdown';
import queryString from 'query-string';
import Page from './Page';
import './App.css';
import SourceEntry from './SourceEntry';

class App extends React.Component {

  componentDidMount() {
    if (window.location.search.length === 0) {
      const cachedUrl = localStorage.toc;
      if (typeof cachedUrl === 'string') {
        const encodedUrl = encodeURIComponent(cachedUrl);
        window.location.search = `url=${encodedUrl}`;
      }
    }
  }

  onChangeToc = url => {
    localStorage.toc = url;
    const encodedUrl = encodeURIComponent(url);
    window.location.search = `url=${encodedUrl}`;
  }

  render() {
    const search = window.location.search;
    
    // Check for base url
    if (search.length === 0) {
      return (
        <Page>
          <SourceEntry onSubmit={this.onChangeToc} />
        </Page>
      )
    }

    const { url } = queryString.parse(search);

    if (typeof url === 'string') {
      return (
        <Page>
          <Markdown url={url} />
        </Page>
      );
    } else {
      return (
        <Page>
          <div className="error">
            Please enter a valid URL
          </div>
        </Page>
      );
    }
  }
}

export default App;