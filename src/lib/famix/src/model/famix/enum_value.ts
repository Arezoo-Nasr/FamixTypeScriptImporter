import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { StructuralEntity } from "./structural_entity";
import { Enum } from "./enum";

export class EnumValue extends StructuralEntity {

  private parentEntity: Enum;

  public getParentEntity(): Enum {
    return this.parentEntity;
  }

  public setParentEntity(parentEntity: Enum): void {
    this.parentEntity = parentEntity;
    parentEntity.addValue(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("EnumValue", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentEntity", this.getParentEntity());
  }
}
