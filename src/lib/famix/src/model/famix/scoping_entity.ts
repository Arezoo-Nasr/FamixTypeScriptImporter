// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ContainerEntity } from "./container_entity";
import { Namespace } from "./namespace";

export class ScopingEntity extends ContainerEntity {

  private childrenNamespaces: Set<Namespace> = new Set();


  public getChildrenNamespaces(): Set<Namespace> {
    return this.childrenNamespaces;
  }

  public addChildrenNamespaces(childrenNamespaces: Namespace) {
    if (!this.childrenNamespaces.has(childrenNamespaces)) {
      this.childrenNamespaces.add(childrenNamespaces);
      childrenNamespaces.setParentScope(this);
    }
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);



  }

}

