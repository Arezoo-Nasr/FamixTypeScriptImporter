// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { AbstractFileAnchor } from "./../famix/abstract_file_anchor";

export class FileAnchor extends AbstractFileAnchor {

  private fileAnchorEndLine: number;

  // @FameProperty(name = "endLine")
  public getEndLine(): number {
    return this.fileAnchorEndLine;
  }

  public setEndLine(fileAnchorEndLine: number) {
    this.fileAnchorEndLine = fileAnchorEndLine;
  }

  private fileAnchorEndColumn: number;

  // @FameProperty(name = "endColumn")
  public getEndColumn(): number {
    return this.fileAnchorEndColumn;
  }

  public setEndColumn(fileAnchorEndColumn: number) {
    this.fileAnchorEndColumn = fileAnchorEndColumn;
  }

  private fileAnchorStartColumn: number;

  // @FameProperty(name = "startColumn")
  public getStartColumn(): number {
    return this.fileAnchorStartColumn;
  }

  public setStartColumn(fileAnchorStartColumn: number) {
    this.fileAnchorStartColumn = fileAnchorStartColumn;
  }

  private fileAnchorStartLine: number;

  // @FameProperty(name = "startLine")
  public getStartLine(): number {
    return this.fileAnchorStartLine;
  }

  public setStartLine(fileAnchorStartLine: number) {
    this.fileAnchorStartLine = fileAnchorStartLine;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("endLine", this.getEndLine());
    exporter.addProperty("endColumn", this.getEndColumn());
    exporter.addProperty("startColumn", this.getStartColumn());
    exporter.addProperty("startLine", this.getStartLine());

  }

}

