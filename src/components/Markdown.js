import React from 'react';
import ReactMarkdown from 'react-markdown';

function makeHeadingRenderer() {
  let n = 0;
  return function HeadingRenderer(props) {
    const id = `${n}`;
    n++;
    return React.createElement('h' + props.level, { id }, props.children);
  }
}

export default class Markdown extends React.Component {
  state = {
    markdown: null,
    error: false
  }

  async componentDidMount() {
    try {
      const { url } = this.props;
      const response = await fetch(url);
      const markdown = await response.text();
      this.setState({
        ...this.state,
        markdown
      });
    } catch (err) {
      console.log(err);
      this.setState({
        ...this.state,
        error: true
      });
    }
  }

  render() {
    const { error, markdown } = this.state;
    if (error) {
      const { url } = this.props;
      return <div className="error">Error loading resource: <span className="code">{url}</span></div>;
    } else if (markdown !== null && markdown !== undefined) {
      const HeadingRenderer = makeHeadingRenderer();
      return <div className="page"><ReactMarkdown source={markdown} renderers={{heading: HeadingRenderer}} /></div>;
    } else {
      return <div />;
    }
  }
}