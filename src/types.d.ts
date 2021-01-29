import { CoreControls, Annotations, PDFNet } from "@pdftron/webviewer";

declare global {
  interface Window {
    CoreControls: typeof CoreControls;
    Annotations: typeof Annotations;
    PDFNet: typeof PDFNet;
  }
}
