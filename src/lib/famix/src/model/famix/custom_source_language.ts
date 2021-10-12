// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./../famix/source_language";

export class CustomSourceLanguage extends SourceLanguage {

  private customSourceLanguageName: string;

  // @FameProperty(name = "name")
  public getName(): string {
    return this.customSourceLanguageName;
  }

  public setName(customSourceLanguageName: string) {
    this.customSourceLanguageName = customSourceLanguageName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CustomSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());

  }

}

