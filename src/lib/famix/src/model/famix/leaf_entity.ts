// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {NamedEntity} from "./../famix/named_entity";

export class LeafEntity extends NamedEntity {


  public getJSON(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.LeafEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

