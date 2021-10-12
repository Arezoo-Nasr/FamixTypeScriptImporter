// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./../famix/source_language";

export class SmalltalkMonticelloSourceLanguage extends SourceLanguage {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.SmalltalkMonticelloSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

