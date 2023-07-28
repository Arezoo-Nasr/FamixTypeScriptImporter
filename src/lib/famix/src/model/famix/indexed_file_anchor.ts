import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourceAnchor } from "./source_anchor";

export class IndexedFileAnchor extends SourceAnchor {

  private indexedFileAnchorStartPos: number;

  public getStartPos(): number {
    return this.indexedFileAnchorStartPos;
  }

  public setStartPos(indexedFileAnchorStartPos: number): void {
    this.indexedFileAnchorStartPos = indexedFileAnchorStartPos;
  }

  private indexedFileAnchorEndPos: number;

  public getEndPos(): number {
    return this.indexedFileAnchorEndPos;
  }

  public setEndPos(indexedFileAnchorEndPos: number): void {
    this.indexedFileAnchorEndPos = indexedFileAnchorEndPos;
  }

  private fileName: string;

  public getFileName(): string {
    return this.fileName;
  }

  public setFileName(fileName: string): void {
    this.fileName = fileName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("IndexedFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("startPos", this.getStartPos());
    exporter.addProperty("endPos", this.getEndPos());
    exporter.addProperty("fileName", this.getFileName());
  }
}
