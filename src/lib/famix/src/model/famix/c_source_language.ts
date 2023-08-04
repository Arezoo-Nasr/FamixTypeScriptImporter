import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourceLanguage } from "./source_language";

export class CSourceLanguage extends SourceLanguage {

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CSourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
  }
}
