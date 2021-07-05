// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {StructuralEntity} from "./../famix/structural_entity";
import {Type} from "./../famix/type";

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


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.Attribute", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("hasClassScope", this.getHasClassScope());
    exporter.addProperty("parentType", this.getParentType());

  }

}

