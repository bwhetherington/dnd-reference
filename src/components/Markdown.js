import React from "react";
import ReactHtmlParser from "react-html-parser";
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
  const newHref = hrefReplacer(href);
  return <a href={newHref}>{children}</a>;
}

const LINK_REGEX = /href="(.*(md|html)(\?.*)?)"/gm;

function getBaseUrl() {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

function hrefReplacer(href) {
  const local = getBaseUrl();
  const base = removeParameters(href);
  if (base.endsWith(".md") || base.endsWith(".html")) {
    const encodedHref = encodeURIComponent(href);
    // const section = hash !== "" ? `#${hash}` : "";
    return `${local}?url=${encodedHref}`;
  } else {
    return href;
  }
}

function htmlLinkRenderer(source) {
  if (source === null) {
    return "";
  } else {
    return source.replace(
      LINK_REGEX,
      (_, href) => `href=${hrefReplacer(href)}`
    );
  }
}

function removeParameters(url) {
  return url.split(/\?/)[0];
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
    } else if (removeParameters(this.props.url).endsWith(".html")) {
      const html = htmlLinkRenderer(markdown);
      return ReactHtmlParser(html);
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
