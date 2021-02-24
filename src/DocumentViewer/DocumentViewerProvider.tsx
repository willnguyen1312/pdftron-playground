import React, { FC, useRef, useEffect, useCallback, useReducer } from "react";
import { CoreControls } from "@pdftron/webviewer";

import {
  DocumentContext,
  documentReducer,
  documentInitialState,
  SetToolStylesArg,
} from "./documentViewerContext";
import { ToolStyles, SearchResult, AnnotationAction } from "./types";
import { DEFAULT_TOOLSTYLES, TOOLMODES_STYLES, Toolnames } from "./constants";
import { buildSearchModeFlag } from "./helpers";

CoreControls.setWorkerPath("/webviewer");
CoreControls.enableFullPDF(true);

interface DocumentProviderProps {
  fileUrl: string;
}

export const DocumentProvider: FC<DocumentProviderProps> = ({
  children,
  fileUrl,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [documentState, dispatch] = useReducer(
    documentReducer,
    documentInitialState
  );
  const docViewerRef = useRef<CoreControls.DocumentViewer>(
    new window.CoreControls.DocumentViewer()
  );
  const annotationManagerRef = useRef<CoreControls.AnnotationManager>(
    docViewerRef.current.getAnnotationManager()
  );
  const execSearchText = () => {
    const results: SearchResult[] = [];
    let hasActiveResultBeenSet = false;
    docViewerRef.current.textSearchInit(
      documentState.search.value,
      buildSearchModeFlag(),
      {
        fullSearch: true,
        onResult: (result) => {
          results.push(result);
          docViewerRef.current.displayAdditionalSearchResult(result);
          if (!hasActiveResultBeenSet) {
            // when full search is done, we make first found result to be the active result
            docViewerRef.current.setActiveSearchResult(result);
            hasActiveResultBeenSet = true;
          }
        },
        onDocumentEnd: () =>
          dispatch({
            type: "setSearchResults",
            value: results,
          }),
      }
    );
  };

  const setToolMode = useCallback((value: Toolnames) => {
    docViewerRef.current.setToolMode(docViewerRef.current.getTool(value));
  }, []);

  const setToolStyles = useCallback(
    ({ toolMode, toolStyles }: SetToolStylesArg) => {
      docViewerRef.current.getTool(toolMode).setStyles(toolStyles);
    },
    []
  );

  useEffect(() => {
    if (scrollViewRef.current && viewerRef.current) {
      docViewerRef.current.setScrollViewElement(scrollViewRef.current);
      docViewerRef.current.setViewerElement(viewerRef.current);

      scrollViewRef.current.addEventListener("scroll", (event) => {
        dispatch({
          type: "setViewerCurrentScrollHeight",
          value: (event.currentTarget as HTMLDivElement).scrollTop,
        });
      });
    }
  }, []);

  // Attach event listeners
  useEffect(() => {
    // Docviewer
    docViewerRef.current.on("documentLoaded", () => {
      dispatch({
        type: "setViewerDocumentheight",
        value: docViewerRef.current.getViewerElement().scrollHeight,
      });
      dispatch({
        type: "setViewerDocumentContainerHeight",
        value: docViewerRef.current.getScrollViewElement().clientHeight,
      });
    });

    docViewerRef.current.on("toolModeUpdated", (tool) => {
      dispatch({ type: "setDocumentToolMode", value: tool.name });
    });

    docViewerRef.current.on("toolUpdated", (updatedTool) => {
      dispatch({
        type: "setDocumentToolStyles",
        value: {
          toolMode: updatedTool.name,
          toolStyles: updatedTool.defaults,
        },
      });
    });

    docViewerRef.current.on("beforeDocumentLoaded", () => {
      dispatch({
        type: "setViewerTotalPages",
        value: docViewerRef.current.getPageCount(),
      });
    });

    docViewerRef.current.on("pageNumberUpdated", () => {
      dispatch({
        type: "setViewerCurrentPage",
        value: docViewerRef.current.getCurrentPage(),
      });
    });

    // Annotation Manager
    annotationManagerRef.current.on(
      "annotationChanged",
      (annotationList, action) => {
        switch (action) {
          case AnnotationAction.DELETE:
            dispatch({ type: "setAnnotationSelected", value: [] });
            break;
          case AnnotationAction.MODIFY:
            dispatch({ type: "setAnnotationSelected", value: annotationList });
            break;
        }
      }
    );

    annotationManagerRef.current.on(
      "annotationSelected",
      (annotationList, action) => {
        switch (action) {
          case AnnotationAction.SELECTED:
            dispatch({ type: "setAnnotationSelected", value: annotationList });
            break;
          case AnnotationAction.DESELECTED:
            dispatch({ type: "setAnnotationSelected", value: [] });
            break;
        }
      }
    );
  }, [setToolMode, dispatch, setToolStyles]);

  // Initial setup
  useEffect(() => {
    docViewerRef.current.setOptions({ enableAnnotations: true });
    setToolMode(Toolnames.AnnotationEdit);
    TOOLMODES_STYLES.forEach((toolMode) => {
      const defaultStyles = DEFAULT_TOOLSTYLES[toolMode];
      setToolStyles({
        toolMode,
        toolStyles: defaultStyles,
      });
    });
  }, [setToolStyles, setToolMode]);

  // Load PDF Evidence
  useEffect(() => {
    if (fileUrl) {
      docViewerRef.current.loadDocument(fileUrl);
    }
  }, [fileUrl]);

  const setSearchValue = (value: string) => {
    dispatch({ type: "setSearchValue", value });
  };

  const setSearchSelected = (value: Record<number, boolean>) => {
    dispatch({ type: "setSearchSelected", value });
  };

  const deletedSelectedAnnotations = () => {
    annotationManagerRef.current.deleteAnnotation(
      documentState.annotation.selected
    );
  };

  const setAnnotationStyle = (styles: Partial<ToolStyles>) => {
    const selectedAnnotation = documentState.annotation.selected[0];
    annotationManagerRef.current.setAnnotationStyles(
      selectedAnnotation,
      styles
    );
  };

  const clearSearchResult = () => {
    setSearchValue("");
    dispatch({ type: "setSearchResults", value: [] });
  };

  const createRedactionAnnotations = async () => {
    const {
      search: { results },
      document: { toolStyles },
    } = documentState;

    dispatch({
      type: "setAnnotationDrawing",
      value: true,
    });

    const redactionStyle = toolStyles[Toolnames.AnnotationCreateRedaction];
    const redactAnnotations = results.map((item) => {
      return new window.Annotations.RedactionAnnotation({
        PageNumber: item.pageNum,
        // This is not part of the typing but is available at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quads: item.quads.map((quad) => (quad as any).getPoints()),
        ...redactionStyle,
      });
    });

    annotationManagerRef.current.addAnnotations(redactAnnotations);
    await annotationManagerRef.current.drawAnnotationsFromList(
      redactAnnotations
    );

    dispatch({
      type: "setAnnotationDrawing",
      value: false,
    });
    clearSearchResult();
  };

  return (
    <DocumentContext.Provider
      value={{
        viewerRef,
        scrollViewRef,
        execSearchText,
        setToolMode,
        setToolStyles,
        setSearchValue,
        setSearchSelected,
        deletedSelectedAnnotations,
        setAnnotationStyle,
        createRedactionAnnotations,
        clearSearchResult,
        ...documentState,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
