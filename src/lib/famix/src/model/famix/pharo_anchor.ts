// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceAnchor } from "./../famix/source_anchor";

export class PharoAnchor extends SourceAnchor {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.PharoAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

