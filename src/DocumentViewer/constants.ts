import { convertRgbaToAnnotationColor } from './helpers'
import { ToolStyles } from './types'

// These events are not available at typing but are available at runtime
export enum Toolnames {
  AnnotationCreateArrow = 'AnnotationCreateArrow',
  AnnotationCreateCallout = 'AnnotationCreateCallout',
  AnnotationCreateEllipse = 'AnnotationCreateEllipse',
  AnnotationCreateFreeHand = 'AnnotationCreateFreeHand',
  AnnotationCreateFreeText = 'AnnotationCreateFreeText',
  AnnotationCreateLine = 'AnnotationCreateLine',
  AnnotationCreatePolygon = 'AnnotationCreatePolygon',
  AnnotationCreatePolygonCloud = 'AnnotationCreatePolygonCloud',
  AnnotationCreatePolyline = 'AnnotationCreatePolyline',
  AnnotationCreateRectangle = 'AnnotationCreateRectangle',
  AnnotationCreateDistanceMeasurement = 'AnnotationCreateDistanceMeasurement',
  AnnotationCreatePerimeterMeasurement = 'AnnotationCreatePerimeterMeasurement',
  AnnotationCreateAreaMeasurement = 'AnnotationCreateAreaMeasurement',
  AnnotationCreateRectangularAreaMeasurement = 'AnnotationCreateRectangularAreaMeasurement',
  AnnotationCreateEllipseMeasurement = 'AnnotationCreateEllipseMeasurement',
  AnnotationCreateCountMeasurement = 'AnnotationCreateCountMeasurement',
  AnnotationCreateSignature = 'AnnotationCreateSignature',
  AnnotationCreateStamp = 'AnnotationCreateStamp',
  AnnotationCreateFileAttachment = 'AnnotationCreateFileAttachment',
  AnnotationCreateRubberStamp = 'AnnotationCreateRubberStamp',
  AnnotationCreateSticky = 'AnnotationCreateSticky',
  AnnotationCreateTextHighlight = 'AnnotationCreateTextHighlight',
  AnnotationCreateTextSquiggly = 'AnnotationCreateTextSquiggly',
  AnnotationCreateTextStrikeout = 'AnnotationCreateTextStrikeout',
  AnnotationCreateTextUnderline = 'AnnotationCreateTextUnderline',
  AnnotationCreateRedaction = 'AnnotationCreateRedaction',
  TextSelect = 'TextSelect',
  AnnotationEdit = 'AnnotationEdit',
  Pan = 'Pan',
  CROP = 'CropPage',
  MarqueeZoomTool = 'MarqueeZoomTool',
  AnnotationEraserTool = 'AnnotationEraserTool',
  AnnotationCreateFreeHand2 = 'AnnotationCreateFreeHand2',
  AnnotationCreateFreeHand3 = 'AnnotationCreateFreeHand3',
  AnnotationCreateFreeHand4 = 'AnnotationCreateFreeHand4',
  AnnotationCreateTextHighlight2 = 'AnnotationCreateTextHighlight2',
  AnnotationCreateTextHighlight3 = 'AnnotationCreateTextHighlight3',
  AnnotationCreateTextHighlight4 = 'AnnotationCreateTextHighlight4',
}

export const TOOLMODES_STYLES = [
  Toolnames.AnnotationCreateRectangle,
  Toolnames.AnnotationCreateRedaction,
  Toolnames.AnnotationCreateFreeText,
]

// Pdftron requires color map to be in rgba string format
export const ColorMap = {
  blue50: 'rgba(46,139,246,1)',
  green50: 'rgba(20,204,149,1)',
  red40: 'rgba(255,138,140,1)',
  yellow60: 'rgba(255,215,0,1)',
  black: 'rgba(0,0,0,1)',
  transparent: 'rgba(0,0,0,0)',
}

export const DEFAULT_TOOLSTYLES: Record<
  Toolnames.AnnotationCreateRectangle | Toolnames.AnnotationCreateRedaction | Toolnames.AnnotationCreateFreeText,
  Partial<ToolStyles>
> = {
  AnnotationCreateRectangle: {
    StrokeColor: convertRgbaToAnnotationColor(ColorMap.black),
    StrokeThickness: 1,
    Opacity: 1,
    FillColor: convertRgbaToAnnotationColor(ColorMap.transparent),
  },
  AnnotationCreateFreeText: {
    StrokeThickness: 1,
    Opacity: 1,
    TextColor: convertRgbaToAnnotationColor(ColorMap.black),
    FillColor: convertRgbaToAnnotationColor(ColorMap.transparent),
  },
  AnnotationCreateRedaction: {
    StrokeColor: convertRgbaToAnnotationColor(ColorMap.black),
    StrokeThickness: 1,
    Opacity: 1,
    FillColor: convertRgbaToAnnotationColor(ColorMap.black),
  },
}
