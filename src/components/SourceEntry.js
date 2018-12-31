import React from 'react';
import './SourceEntry.css';

class SourceEntry extends React.Component {
  state = {
    url: ''
  };

  onChangeUrl = event => this.setState({
    url: event.target.value
  });

  onSubmit = () => {
    console.log('submit');
    const { url } = this.state;
    const trimmed = url.trim();
    if (trimmed.length > 0) {
      console.log(trimmed);
      this.props.onSubmit(trimmed);
    }
  }

  render() {
    const { url } = this.state;
    return (
      <div className="sourceEntry">
        <input className="textInput" type="text" value={url} onChange={this.onChangeUrl} placeholder="Source URL" />
        <br />
        <button className="button" onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}

export default SourceEntry;