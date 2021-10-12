// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";

export class TypeAlias extends Type {

  private typeAliasAliasedType: Type;

  // oneMany.Getter
  // @FameProperty(name = "aliasedType", opposite = "typeAliases")
  public getAliasedType(): Type {
    return this.typeAliasAliasedType;
  }

  // oneMany.Setter
  public setAliasedType(newAliasedType: Type) {
    this.typeAliasAliasedType = newAliasedType;
    newAliasedType.getTypeAliases().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.TypeAlias", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("aliasedType", this.getAliasedType());

  }

}

