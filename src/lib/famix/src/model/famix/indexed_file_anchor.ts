// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {AbstractFileAnchor} from "./../famix/abstract_file_anchor";

export class IndexedFileAnchor extends AbstractFileAnchor {

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


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.IndexedFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("startPos", this.getStartPos());
    exporter.addProperty("endPos", this.getEndPos());

  }

}

