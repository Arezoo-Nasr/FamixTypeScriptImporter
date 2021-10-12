// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceAnchor } from "./../famix/source_anchor";

export class AbstractFileAnchor extends SourceAnchor {

  private abstractFileAnchorFileName: string;

  // @FameProperty(name = "fileName")
  public getFileName(): string {
    return this.abstractFileAnchorFileName;
  }

  public setFileName(abstractFileAnchorFileName: string) {
    this.abstractFileAnchorFileName = abstractFileAnchorFileName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("AbstractFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("fileName", this.getFileName());

  }

}

