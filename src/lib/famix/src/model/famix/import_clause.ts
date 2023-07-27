// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Association } from "./association";
import { Module } from "./module";
import { NamedEntity } from "./named_entity";

export class ImportClause extends Association {

  private importer: Module;

  public getImporter(): Module {
    return this.importer;
  }

  public setImporter(newImporter: Module) {
    this.importer = newImporter;
    newImporter.addImportClause(this);
  }

  private importedEntity: NamedEntity;

  public getImportedEntity(): NamedEntity {
    return this.importedEntity;
  }

  public setImportedEntity(newImportedEntity: NamedEntity) {
    this.importedEntity = newImportedEntity;
    newImportedEntity.addImport(this);
  }

  private moduleSpecifier: string;

  public getModuleSpecifier(): string {
    return this.moduleSpecifier;
  }

  public setModuleSpecifier(newModuleSpecifier: string) {
    this.moduleSpecifier = newModuleSpecifier;
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);



  }

}

