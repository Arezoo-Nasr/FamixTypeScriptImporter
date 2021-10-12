// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";

export class PrimitiveType extends Type {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("PrimitiveType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

