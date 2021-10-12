// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { Enum } from "./../famix/enum";

export class EnumValue extends StructuralEntity {

  private enumValueParentEnum: Enum;

  // oneMany.Getter
  // @FameProperty(name = "parentEnum", opposite = "values")
  public getParentEnum(): Enum {
    return this.enumValueParentEnum;
  }

  // oneMany.Setter
  public setParentEnum(newParentEnum: Enum) {
    this.enumValueParentEnum = newParentEnum;
    newParentEnum.getValues().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("EnumValue", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentEnum", this.getParentEnum());

  }

}

