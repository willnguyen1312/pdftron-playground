import { CoreControls } from "@pdftron/webviewer";
import { useRef, useEffect, useState } from "react";
import SearchContainer from "./components/SearchContainer";
import { ReactComponent as ZoomIn } from "./assets/icons/ic_zoom_in_black_24px.svg";
import { ReactComponent as ZoomOut } from "./assets/icons/ic_zoom_out_black_24px.svg";
import { ReactComponent as AnnotationRectangle } from "./assets/icons/ic_annotation_square_black_24px.svg";
import { ReactComponent as AnnotationRedact } from "./assets/icons/ic_annotation_add_redact_black_24px.svg";
import { ReactComponent as AnnotationApplyRedact } from "./assets/icons/ic_annotation_apply_redact_black_24px.svg";
import { ReactComponent as Search } from "./assets/icons/ic_search_black_24px.svg";
import { ReactComponent as Select } from "./assets/icons/ic_select_black_24px.svg";
import "./App.css";

const App = () => {
  const viewer = useRef<HTMLDivElement>(null);
  const scrollView = useRef<HTMLDivElement>(null);
  const searchTerm = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [docViewer, setDocViewer] = useState<CoreControls.DocumentViewer>();
  const [
    annotManager,
    setAnnotManager,
  ] = useState<CoreControls.AnnotationManager>();
  const [searchContainerOpen, setSearchContainerOpen] = useState(false);

  const Annotations = window.Annotations;

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if (!scrollView.current || !viewer.current) {
      return;
    }
    const CoreControls = window.CoreControls;
    CoreControls.setWorkerPath("/webviewer/7.3.0");
    CoreControls.enableFullPDF(true);

    const docViewer = new CoreControls.DocumentViewer();
    (window as any).docViewer = docViewer;
    docViewer.setScrollViewElement(scrollView.current);
    docViewer.setViewerElement(viewer.current);
    docViewer.setOptions({ enableAnnotations: true });
    docViewer.loadDocument("/files/pdftron_about.pdf");

    setDocViewer(docViewer as any);

    docViewer.on("documentLoaded", () => {
      docViewer.setToolMode(docViewer.getTool("AnnotationEdit"));
      setAnnotManager(docViewer.getAnnotationManager() as any);
    });
  }, []);

  const zoomOut = () => {
    if (docViewer) {
      docViewer.zoomTo(docViewer.getZoom() - 0.25);
    }
  };

  const zoomIn = () => {
    if (docViewer) {
      docViewer.zoomTo(docViewer.getZoom() + 0.25);
    }
  };

  const createRectangle = () => {
    if (docViewer) {
      docViewer.setToolMode(docViewer.getTool("AnnotationCreateRectangle"));
    }
  };

  const general = async () => {
    if (annotManager) {
      const redactAnnot1 = new Annotations.RedactionAnnotation({
        PageNumber: 1,
        Rect: new (Annotations as any).Rect(100, 100, 300, 200), // Rect are in the form x1,y1,x2,y2
        StrokeColor: new Annotations.Color(255, 255, 255, 1),
        FillColor: new Annotations.Color(255, 255, 255, 1),
      });

      const redactAnnot2 = new Annotations.RedactionAnnotation({
        PageNumber: 1,
        StrokeColor: new Annotations.Color(0, 255, 0, 1),
        FillColor: new Annotations.Color(255, 255, 255, 1),
        Quads: [
          // Quads are in the form x1,y1,x2,y2,x3,y3,x4,y4
          new (Annotations as any).Quad(100, 290, 300, 210, 300, 210, 100, 290),
          new (Annotations as any).Quad(100, 390, 300, 310, 300, 310, 100, 390),
        ],
      });

      const redactAnnotations = [redactAnnot1, redactAnnot2];

      annotManager.addAnnotations(redactAnnotations as any);

      // need to draw the annotations otherwise they won't show up until the page is refreshed
      annotManager.drawAnnotationsFromList(redactAnnotations as any);
    }
  };

  const selectTool = () => {
    if (docViewer) {
      docViewer.setToolMode(docViewer.getTool("AnnotationEdit"));
    }
  };

  const createRedaction = () => {
    if (docViewer) {
      docViewer.setToolMode(docViewer.getTool(""));
    }
  };

  const applyRedactions = async () => {
    if (docViewer) {
      const annotManager = docViewer.getAnnotationManager();
      annotManager.enableRedaction(true);
      await annotManager.applyRedactions();
    }
  };

  return (
    <div className="App">
      <div id="main-column">
        <div className="center" id="tools">
          <button onClick={general}>General</button>
          <button onClick={zoomOut}>
            <ZoomOut />
          </button>
          <button onClick={zoomIn}>
            <ZoomIn />
          </button>
          <button onClick={createRectangle}>
            <AnnotationRectangle />
          </button>
          <button onClick={createRedaction}>
            <AnnotationRedact />
          </button>
          <button onClick={applyRedactions}>
            <AnnotationApplyRedact />
          </button>
          <button onClick={selectTool}>
            <Select />
          </button>
          <button
            onClick={() => {
              // Flip the boolean
              setSearchContainerOpen((prevState) => !prevState);
            }}
          >
            <Search />
          </button>
        </div>
        <div className="flexbox-container" id="scroll-view" ref={scrollView}>
          <div id="viewer" ref={viewer}></div>
        </div>
      </div>
      <div className="flexbox-container">
        <SearchContainer
          Annotations={Annotations}
          annotManager={annotManager}
          docViewer={docViewer}
          searchTermRef={searchTerm}
          searchContainerRef={searchContainerRef}
          open={searchContainerOpen}
        />
      </div>
    </div>
  );
};

export default App;
