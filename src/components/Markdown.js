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

function LinkRenderer(props) {
  const { href } = props;
  const hash = href.split(/#/)[1];
  const encodedURI = encodeURIComponent(href);
  const { origin, pathname } = window.location;
  const newHref = hash !== undefined
    ? `${origin}${pathname}?url=${encodedURI}#${hash}`
    : `${origin}${pathname}?url=${encodedURI}`;
  const onClick = () => {
    window.location.href = newHref;
  };
  return <span className="link" onClick={onClick}>{props.children}</span>
}

export default class Markdown extends React.Component {
  state = {
    markdown: null,
    error: false
  }

  async componentDidMount() {
    try {
      const { url } = this.props;
      const [href, anchor] = url.split(/#/);
      const response = await fetch(href);
      const markdown = await response.text();
      this.setState({
        ...this.state,
        markdown
      });
      if (anchor !== undefined) {
        const node = document.getElementById(anchor);
        if (node !== null && node !== undefined) {
          node.scrollIntoView(true);
        }
      }
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
      const renderers = {
        heading: HeadingRenderer,
        link: LinkRenderer
      };
      return (
        <div className="page">
          <ReactMarkdown 
            source={markdown} 
            renderers={renderers} 
          />
        </div>
      );
    } else {
      return <div />;
    }
  }
}