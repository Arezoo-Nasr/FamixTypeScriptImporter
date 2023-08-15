import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { EnumValue } from "./enum_value";
import { ContainerEntity } from "./container_entity";

export class Enum extends Type {

  private enumValues: Set<EnumValue> = new Set();

  public getValues(): Set<EnumValue> {
    return this.enumValues;
  }

  public addValue(enumValue: EnumValue): void {
    if (!this.enumValues.has(enumValue)) {
      this.enumValues.add(enumValue);
      enumValue.setParentEntity(this);
    }
  }

  private parentEntity: ContainerEntity;

  public getParentEntity(): ContainerEntity {
    return this.parentEntity;
  }

  public setParentEntity(parentEntity: ContainerEntity): void {
    this.parentEntity = parentEntity;
    parentEntity.addEnum(this);
  }
  

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Enum", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("values", this.getValues());
    exporter.addProperty("parentEntity", this.getParentEntity());
  }
}
