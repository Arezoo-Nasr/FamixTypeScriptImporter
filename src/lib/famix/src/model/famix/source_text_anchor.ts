// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceAnchor } from "./../famix/source_anchor";

export class SourceTextAnchor extends SourceAnchor {

  private sourceTextAnchorSource: string;

  // @FameProperty(name = "source")
  public getSource(): string {
    return this.sourceTextAnchorSource;
  }

  public setSource(sourceTextAnchorSource: string) {
    this.sourceTextAnchorSource = sourceTextAnchorSource;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.SourceTextAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("source", this.getSource());

  }

}

