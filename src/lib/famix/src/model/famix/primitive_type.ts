// automatically generated code, please do not change

import { FamixMseExporter } from "../../famix_mse_exporter";
import { Type } from "./../famix/type";

export class PrimitiveType extends Type {


  public getJSON(): string {
    const mse: FamixMseExporter = new FamixMseExporter("PrimitiveType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

