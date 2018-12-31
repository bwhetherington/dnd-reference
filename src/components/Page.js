import React from 'react';

function deleteToc() {
  delete localStorage.toc;
}

function Page(props) {
  const { children = [] } = props;
  return (
    <React.Fragment>
      <div className="pageContainer">
        <div className="page">
          {children}
        </div>
      </div>
      <footer>
        <div className="footerContainer">
          <p>
            Official D&D content is the intellectual property of Wizards of the Coast.
          </p>
          <p>
            This website's favicon was made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> and is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>.
          </p>
          <button onClick={deleteToc}>Reset Cached Table of Contents</button>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default Page;