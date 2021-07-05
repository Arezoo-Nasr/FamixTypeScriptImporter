// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {SourceAnchor} from "./../famix/source_anchor";

export class AbstractFileAnchor extends SourceAnchor {

  private abstractFileAnchorFileName: string;

  // @FameProperty(name = "fileName")
  public getFileName(): string {
    return this.abstractFileAnchorFileName;
  }

  public setFileName(abstractFileAnchorFileName: string) {
    this.abstractFileAnchorFileName = abstractFileAnchorFileName;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.AbstractFileAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("fileName", this.getFileName());

  }

}

