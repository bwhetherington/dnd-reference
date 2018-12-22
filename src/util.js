import React from 'react';

const headerRegex = /(.*){(.*)}/;

export function parseHeader(header) {
  const matches = header.match(headerRegex);
  if (matches) {
    const headerText = matches[1];
    const anchorText = matches[2];
    return { headerText: headerText.trim(), anchorText };
  } else {
    return { headerText: header.trim(), anchorText: null };
  }
}

export function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}