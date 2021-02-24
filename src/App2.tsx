import "./App2.css";
import { DocumentProvider, DocumentContext } from "./DocumentViewer";

const App = () => {
  return (
    <DocumentProvider fileUrl="/files/pdftron_about.pdf">
      <div className="App">
        <div id="main-column">
          <div className="center" id="tools"></div>
          <DocumentContext.Consumer>
            {({ scrollViewRef, viewerRef }) => {
              return (
                <div
                  className="flexbox-container"
                  id="scroll-view"
                  ref={scrollViewRef}
                >
                  <div id="viewer" ref={viewerRef}></div>
                </div>
              );
            }}
          </DocumentContext.Consumer>
        </div>
      </div>
    </DocumentProvider>
  );
};

export default App;
