// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { NamedEntity } from "./named_entity";

export class Alias extends NamedEntity {

  private aliasedEntity: NamedEntity;

  // oneMany.Getter
  // @FameProperty(name = "aliasedType", opposite = "typeAliases")
  public getAliasedEntity(): NamedEntity {
    return this.aliasedEntity;
  }

  // oneMany.Setter
  public setAliasedEntity(newAliasedEntity: NamedEntity) {
    this.aliasedEntity = newAliasedEntity;
    newAliasedEntity.addAlias(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.TypeAlias", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("aliasedType", this.getAliasedEntity());

  }

}

