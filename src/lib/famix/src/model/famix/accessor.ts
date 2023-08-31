import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Method } from "./method";

export class Accessor extends Method {
  
  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Accessor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
  }
}
