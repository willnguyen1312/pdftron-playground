import { Annotations, CoreControls } from '@pdftron/webviewer'

export interface FreeTextToolStyles {
  FillColor: Annotations.Color
  Font: string
  FontSize: string
  Opacity: number
  StrokeColor: Annotations.Color
  StrokeThickness: number
  TextAlign: string
  TextColor: Annotations.Color
}

export interface RedactionToolStyles {
  FillColor: Annotations.Color
  FontSize: string
  Opacity: number
  OverlayText: string
  StrokeColor: Annotations.Color
  StrokeThickness: number
  TextColor: Annotations.Color
}

export interface RectangleToolStyles {
  FillColor: Annotations.Color
  StrokeColor: Annotations.Color
  Opacity: number
  StrokeThickness: number
}

export type ToolStyles = FreeTextToolStyles | RedactionToolStyles | RectangleToolStyles

export interface SearchResult {
  ambientStr: string
  resultStr: string
  resultStrStart: number
  resultStrEnd: number
  pageNum: number
  resultCode: number
  quads: CoreControls.Math.Quad[]
}

export enum AnnotationAction {
  ADD = 'add',
  DELETE = 'delete',
  MODIFY = 'modify',
  SELECTED = 'selected',
  DESELECTED = 'deselected',
}
