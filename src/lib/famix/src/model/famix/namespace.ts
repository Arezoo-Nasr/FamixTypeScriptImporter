// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScopingEntity } from "./../famix/scoping_entity";

export class Namespace extends ScopingEntity {

  private namespaceNumberOfAttributes: number;

  // @FameProperty(name = "numberOfAttributes")
  public getNumberOfAttributes(): number {
    return this.namespaceNumberOfAttributes;
  }

  public setNumberOfAttributes(namespaceNumberOfAttributes: number) {
    this.namespaceNumberOfAttributes = namespaceNumberOfAttributes;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Namespace", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("numberOfAttributes", this.getNumberOfAttributes());

  }

}

