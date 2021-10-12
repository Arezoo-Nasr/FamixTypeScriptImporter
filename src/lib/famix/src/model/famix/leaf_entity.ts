// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { NamedEntity } from "./../famix/named_entity";

export class LeafEntity extends NamedEntity {


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.LeafEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

