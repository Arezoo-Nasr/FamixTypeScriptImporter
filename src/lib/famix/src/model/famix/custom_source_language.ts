import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./source_language";

export class CustomSourceLanguage extends SourceLanguage {

  private languageName: string;

  public getLanguageName(): string {
    return this.languageName;
  }

  public setLanguageName(languageName: string): void {
    this.languageName = languageName;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CustomSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("languageName", this.getLanguageName());
  }
}
