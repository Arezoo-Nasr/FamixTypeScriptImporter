// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./../famix/source_language";

export class CSourceLanguage extends SourceLanguage {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

