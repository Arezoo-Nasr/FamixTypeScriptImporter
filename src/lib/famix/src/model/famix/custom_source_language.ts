import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourceLanguage } from "./source_language";

export class CustomSourceLanguage extends SourceLanguage {

  private customSourceLanguageName: string;

  public getName(): string {
    return this.customSourceLanguageName;
  }

  public setName(customSourceLanguageName: string): void {
    this.customSourceLanguageName = customSourceLanguageName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CustomSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());
  }
}
