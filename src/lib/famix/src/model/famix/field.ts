// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Class } from "./class";
import { StructuralEntity } from "./structural_entity";
import { Type } from "./type";

export class Field extends StructuralEntity {

  public getParentEntity() {
    return this.getParentType();
  }

  public setParentEntity(newParentEntity: Class) {
    this.setParentType(newParentEntity);
  }

  private hasClassScope: boolean;

  // @FameProperty(name = "hasClassScope")
  public getHasClassScope(): boolean {
    return this.hasClassScope;
  }

  public setHasClassScope(attributeHasClassScope: boolean) {
    this.hasClassScope = attributeHasClassScope;
  }

  private attributeParentType: Type;

  // oneMany.Getter
  // @FameProperty(name = "parentType", opposite = "attributes")
  public getParentType(): Type {
    return this.attributeParentType;
  }

  // oneMany.Setter
  public setParentType(newParentType: Type) {
    this.attributeParentType = newParentType;
    newParentType.getAttributes().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Attribute", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("hasClassScope", this.getHasClassScope());
    exporter.addProperty("parentType", this.getParentType());

  }

}

