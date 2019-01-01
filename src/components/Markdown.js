import React from "react";
import ReactMarkdown from "react-markdown";
import htmlParser from "react-markdown/plugins/html-parser";
import Loading from "./Loading";
import { scrollTo, flatten, getPageName } from "../util";
import "./Markdown.css";

const parseHtml = htmlParser({
  isValidNode: node => node.type !== "script"
});

function TableRenderer(props) {
  return (
    <div className="tableContainer">
      <table>{props.children}</table>
    </div>
  );
}

function HeadingRenderer(props) {
  const { level, children } = props;
  const childrenArray = React.Children.toArray(children);
  const text = childrenArray.reduce(flatten, "");
  const id = text
    .toLowerCase()
    .replace(/(\*|\(|\))/g, "")
    .trim()
    .replace(/\W+/g, "-");
  return React.createElement("h" + level, { id }, children);
}

function LinkRenderer(props) {
  const { href, children } = props;
  const [url, hash] = href.split(/#/);
  const [baseUrl] = url.split(/\?/);
  if (typeof baseUrl === "string" && baseUrl.endsWith(".md")) {
    const encodedURI = encodeURIComponent(href);
    const { origin, pathname } = window.location;
    const newHref =
      hash !== undefined
        ? `${origin}${pathname}?url=${encodedURI}#${hash}`
        : `${origin}${pathname}?url=${encodedURI}`;
    const onClick = () => {
      window.location.href = newHref;
    };
    return (
      <span className="link" onClick={onClick}>
        {children}
      </span>
    );
  } else {
    return <a href={href}>{props.children}</a>;
  }
}

export default class Markdown extends React.Component {
  state = {
    markdown: null,
    error: false
  };

  async componentDidMount() {
    try {
      const { url, cached } = this.props;
      const [href, anchor] = url.split(/#/);
      const response = await fetch(href);
      const markdown = await response.text();

      if (markdown.startsWith("<!DOCTYPE html>")) {
        // Page was not found
        this.setState({
          ...this.state,
          error: true
        });
      } else {
        // Page was found
        this.setState({
          ...this.state,
          markdown
        });

        // Scroll to anchor
        if (anchor !== undefined) {
          const node = document.getElementById(anchor);
          if (node !== null && node !== undefined) {
            scrollTo(node);
          }
        }

        // Set title based on header
        const header = document.getElementById("topBar");
        if (header) {
          const text = header.innerText;
          const title = getPageName(text);
          document.title = title;
        }

        console.log(this.props);

        if (cached) {
          localStorage.toc = url;
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
      return (
        <div className="error">
          Error loading resource:{" "}
          <pre>
            <code>{url}</code>
          </pre>
        </div>
      );
    } else if (markdown !== null && markdown !== undefined) {
      const renderers = {
        heading: HeadingRenderer,
        link: LinkRenderer,
        table: TableRenderer
      };
      return (
        <ReactMarkdown
          source={markdown}
          renderers={renderers}
          escapeHtml={false}
          astPlugins={[parseHtml]}
        />
      );
    } else {
      return <Loading />;
    }
  }
}
