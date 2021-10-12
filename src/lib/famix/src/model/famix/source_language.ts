// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./../famix/entity";
import { SourcedEntity } from "./../famix/sourced_entity";

export class SourceLanguage extends Entity {

  private sourceLanguageSourcedEntities: Set<SourcedEntity> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "sourcedEntities", opposite = "declaredSourceLanguage", derived = true)
  public getSourcedEntities(): Set<SourcedEntity> {
    return this.sourceLanguageSourcedEntities;
  }

  // manyOne.Setter
  public addSourcedEntities(sourceLanguageSourcedEntities: SourcedEntity) {
    if (!this.sourceLanguageSourcedEntities.has(sourceLanguageSourcedEntities)) {
      this.sourceLanguageSourcedEntities.add(sourceLanguageSourcedEntities);
      sourceLanguageSourcedEntities.setDeclaredSourceLanguage(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.SourceLanguage", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("sourcedEntities", this.getSourcedEntities());

  }

}

