import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";

export class PrimitiveType extends Type {

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("PrimitiveType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
  }
}
