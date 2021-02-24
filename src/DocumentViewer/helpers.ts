import isFinite from 'lodash/isFinite'
import { Annotations } from '@pdftron/webviewer'

interface BuildSearchModeFlagOptions {
  caseSensitive?: boolean
  wholeWord?: boolean
  wildcard?: boolean
  regex?: boolean
}

export function buildSearchModeFlag(options: BuildSearchModeFlagOptions = {}) {
  const SearchMode = window.CoreControls.Search.Mode
  let searchMode = SearchMode.PAGE_STOP | SearchMode.HIGHLIGHT

  if (options.caseSensitive) {
    searchMode |= SearchMode.CASE_SENSITIVE
  }
  if (options.wholeWord) {
    searchMode |= SearchMode.WHOLE_WORD
  }
  if (options.wildcard) {
    searchMode |= SearchMode.WILD_CARD
  }
  if (options.regex) {
    searchMode |= SearchMode.REGEX
  }

  searchMode |= SearchMode.AMBIENT_STRING

  return searchMode
}

export const convertRgbaToAnnotationColor = (value: string) => {
  const colorScheme = value
    .slice(value.indexOf('(') + 1, value.lastIndexOf(')'))
    .split(',')
    .map(value => value.trim())

  const RGBA = {
    R: +colorScheme[0],
    G: +colorScheme[1],
    B: +colorScheme[2],
    A: +colorScheme[3],
  }

  return new window.Annotations.Color(RGBA.R, RGBA.G, RGBA.B, isFinite(RGBA.A) ? RGBA.A : 1)
}

export const getAnnotationStyle = (annotation: Annotations.Annotation) => {
  const styleProperty = ['StrokeColor', 'StrokeThickness']
  const style = {}

  styleProperty.forEach(property => {
    const value = annotation[property]

    if (value) {
      style[property] =
        typeof annotation[property] === 'object' ? annotation[property].toString() : annotation[property]
    }
  })

  return style
}
