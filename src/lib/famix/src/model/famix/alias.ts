import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { NamedEntity } from "./named_entity";

export class Alias extends NamedEntity {

  private aliasedEntity: NamedEntity;

  public getAliasedEntity(): NamedEntity {
    return this.aliasedEntity;
  }

  public setAliasedEntity(aliasedEntity: NamedEntity): void {
    this.aliasedEntity = aliasedEntity;
    aliasedEntity.addAlias(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Alias", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("aliasedEntity", this.getAliasedEntity());
  }
}
