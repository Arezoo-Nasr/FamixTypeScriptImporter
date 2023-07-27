// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceAnchor } from "./source_anchor";

export class IndexedFileAnchor extends SourceAnchor {

  private indexedFileAnchorStartPos: number;

  // @FameProperty(name = "startPos")
  public getStartPos(): number {
    return this.indexedFileAnchorStartPos;
  }

  public setStartPos(indexedFileAnchorStartPos: number) {
    this.indexedFileAnchorStartPos = indexedFileAnchorStartPos;
  }

  private indexedFileAnchorEndPos: number;

  // @FameProperty(name = "endPos")
  public getEndPos(): number {
    return this.indexedFileAnchorEndPos;
  }

  public setEndPos(indexedFileAnchorEndPos: number) {
    this.indexedFileAnchorEndPos = indexedFileAnchorEndPos;
  }

  private filename: string;

  public getFilename(): string {
    return this.filename;
  }

  public setFilename(filename: string) {
    this.filename = filename;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("IndexedFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("startPos", this.getStartPos());
    exporter.addProperty("endPos", this.getEndPos());

  }

}

