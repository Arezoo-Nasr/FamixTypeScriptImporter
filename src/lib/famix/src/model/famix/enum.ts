// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";
import { EnumValue } from "./../famix/enum_value";

export class Enum extends Type {

  private enumValues: Set<EnumValue> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "values", opposite = "parentEnum", derived = true)
  public getValues(): Set<EnumValue> {
    return this.enumValues;
  }

  // manyOne.Setter
  public addValues(enumValues: EnumValue) {
    if (!this.enumValues.has(enumValues)) {
      this.enumValues.add(enumValues);
      enumValues.setParentEnum(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Enum", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("values", this.getValues());

  }

}

