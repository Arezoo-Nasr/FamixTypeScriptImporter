import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Variable } from "./variable";

export class ImplicitVariable extends Variable {

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ImplicitVariable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
  }
}
