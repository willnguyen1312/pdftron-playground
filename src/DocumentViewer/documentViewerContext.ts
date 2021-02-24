import { createContext, useContext } from "react";
import { Annotations } from "@pdftron/webviewer";

import { SearchResult, ToolStyles } from "./types";
import { Toolnames } from "./constants";

interface SearchState {
  value: string;
  results: SearchResult[];
  selected: Record<number, boolean>;
}

type SearchAction =
  | { type: "setSearchValue"; value: string }
  | { type: "setSearchResults"; value: SearchResult[] }
  | { type: "setSearchSelected"; value: Record<number, boolean> };

interface ViewerState {
  totalPages: number;
  currentPage: number;
  documentHeight: number;
  documentContainerHeight: number;
  currentScrollHeight: number;
}

type ViewerAction =
  | { type: "setViewerTotalPages"; value: number }
  | { type: "setViewerCurrentPage"; value: number }
  | { type: "setViewerDocumentheight"; value: number }
  | { type: "setViewerDocumentContainerHeight"; value: number }
  | { type: "setViewerCurrentScrollHeight"; value: number };

interface DocumentState {
  toolMode: Toolnames;
  toolStyles: Record<Toolnames, ToolStyles>;
}

type DocumentAction =
  | { type: "setDocumentToolMode"; value: Toolnames }
  | {
      type: "setDocumentToolStyles";
      value: {
        toolMode: Toolnames;
        toolStyles: ToolStyles;
      };
    };

interface AnnotationState {
  selected: Annotations.Annotation[];
  drawing: boolean;
}

type AnnotationAction =
  | {
      type: "setAnnotationSelected";
      value: Annotations.Annotation[];
    }
  | {
      type: "setAnnotationDrawing";
      value: boolean;
    };

interface State {
  search: SearchState;
  viewer: ViewerState;
  document: DocumentState;
  annotation: AnnotationState;
}

type Action = SearchAction | ViewerAction | DocumentAction | AnnotationAction;

export const documentInitialState: State = {
  search: {
    value: "",
    results: [],
    selected: {},
  },
  viewer: {
    totalPages: 0,
    currentPage: 1,
    documentHeight: 0,
    documentContainerHeight: 0,
    currentScrollHeight: 0,
  },
  document: {
    toolMode: Toolnames.AnnotationEdit,
    toolStyles: {} as Record<Toolnames, ToolStyles>,
  },
  annotation: {
    selected: [],
    drawing: false,
  },
};

export const documentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Start Search Slide
    case "setSearchValue":
      return {
        ...state,
        search: {
          ...state.search,
          value: action.value,
        },
      };

    case "setSearchResults":
      return {
        ...state,
        search: {
          ...state.search,
          results: action.value,
          selected: action.value.reduce((acc, _, index) => {
            acc[index] = false;
            return acc;
          }, {}),
        },
      };

    case "setSearchSelected":
      return {
        ...state,
        search: {
          ...state.search,
          selected: {
            ...state.search.selected,
            ...action.value,
          },
        },
      };

    // End Search Slide

    // Start Viewer Slide
    case "setViewerCurrentPage":
      return {
        ...state,
        viewer: {
          ...state.viewer,
          currentPage: action.value,
        },
      };

    case "setViewerDocumentheight":
      return {
        ...state,
        viewer: {
          ...state.viewer,
          documentHeight: action.value,
        },
      };

    case "setViewerCurrentScrollHeight":
      return {
        ...state,
        viewer: {
          ...state.viewer,
          currentScrollHeight: action.value,
        },
      };

    case "setViewerDocumentContainerHeight":
      return {
        ...state,
        viewer: {
          ...state.viewer,
          documentContainerHeight: action.value,
        },
      };

    case "setViewerTotalPages":
      return {
        ...state,
        viewer: {
          ...state.viewer,
          totalPages: action.value,
        },
      };
    // End Viewer Slide

    // Start Document Slide
    case "setDocumentToolMode":
      return {
        ...state,
        document: {
          ...state.document,
          toolMode: action.value,
        },
      };

    case "setDocumentToolStyles":
      return {
        ...state,
        document: {
          ...state.document,
          toolStyles: {
            ...state.document.toolStyles,
            [action.value.toolMode]: action.value.toolStyles,
          },
        },
      };
    // End Document Slide

    // Start Annotation Slide
    case "setAnnotationSelected":
      return {
        ...state,
        annotation: {
          ...state.annotation,
          selected: action.value,
        },
      };

    case "setAnnotationDrawing":
      return {
        ...state,
        annotation: {
          ...state.annotation,
          drawing: action.value,
        },
      };
    // End Annotation Slide

    default:
      throw new Error("unknown action type");
  }
};

export interface SetToolStylesArg {
  toolMode: Toolnames;
  toolStyles: Partial<ToolStyles>;
}

export type DocumentContextType = {
  execSearchText: () => void;
  clearSearchResult: () => void;
  deletedSelectedAnnotations: () => void;
  createRedactionAnnotations: () => void;
  setToolMode: (value: Toolnames) => void;
  setSearchValue: (value: string) => void;
  setSearchSelected: (value: Record<string, boolean>) => void;
  setToolStyles: (arg: SetToolStylesArg) => void;
  setAnnotationStyle: (styles: Partial<ToolStyles>) => void;
  viewerRef: React.RefObject<HTMLDivElement>;
  scrollViewRef: React.RefObject<HTMLDivElement>;
} & State;

export const DocumentContext = createContext<DocumentContextType>({} as any);

export const useDocumentContext = () => {
  const documentContext = useContext(DocumentContext);

  if (!documentContext) {
    throw new Error("Please place the component inside DocumentProvider");
  }

  return documentContext;
};
