// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScopingEntity } from "./scoping_entity";


export class Namespace extends ScopingEntity {

  private parentScope: ScopingEntity;

  public getParentScope(): ScopingEntity {
    return this.parentScope;
  }

  public setParentScope(newParentScope: ScopingEntity) {
    this.parentScope = newParentScope;
    newParentScope.addChildrenNamespaces(this);
  }



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
    exporter.addProperty("parentScope", this.getParentScope());
    exporter.addProperty("numberOfAttributes", this.getNumberOfAttributes());

  }

}

