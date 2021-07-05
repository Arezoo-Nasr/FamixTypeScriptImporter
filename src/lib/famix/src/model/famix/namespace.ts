// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {ScopingEntity} from "./../famix/scoping_entity";

export class Namespace extends ScopingEntity {

  private namespaceNumberOfAttributes: number;

  // @FameProperty(name = "numberOfAttributes")
  public getNumberOfAttributes(): number {
    return this.namespaceNumberOfAttributes;
  }

  public setNumberOfAttributes(namespaceNumberOfAttributes: number) {
    this.namespaceNumberOfAttributes = namespaceNumberOfAttributes;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.Namespace", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("numberOfAttributes", this.getNumberOfAttributes());

  }

}

