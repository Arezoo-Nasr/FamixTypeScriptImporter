// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {SourceLanguage} from "./../famix/source_language";

export class CustomSourceLanguage extends SourceLanguage {

  private customSourceLanguageName: string;

  // @FameProperty(name = "name")
  public getName(): string {
    return this.customSourceLanguageName;
  }

  public setName(customSourceLanguageName: string) {
    this.customSourceLanguageName = customSourceLanguageName;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.CustomSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());

  }

}

