// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { Type } from "./../famix/type";

export class Attribute extends StructuralEntity {

  private attributeHasClassScope: boolean;

  // @FameProperty(name = "hasClassScope")
  public getHasClassScope(): boolean {
    return this.attributeHasClassScope;
  }

  public setHasClassScope(attributeHasClassScope: boolean) {
    this.attributeHasClassScope = attributeHasClassScope;
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

