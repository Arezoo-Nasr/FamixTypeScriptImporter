import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { EnumValue } from "./enum_value";

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
  

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Enum", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("values", this.getValues());
  }
}
