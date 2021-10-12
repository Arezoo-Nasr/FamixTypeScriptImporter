// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./../famix/source_language";

export class UnknownSourceLanguage extends SourceLanguage {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.UnknownSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

