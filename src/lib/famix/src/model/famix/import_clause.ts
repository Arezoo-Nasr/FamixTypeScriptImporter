import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Association } from "./association";
import { Module } from "./module";
import { NamedEntity } from "./named_entity";

export class ImportClause extends Association {

  private importingEntity: Module;

  public getImportingEntity(): Module {
    return this.importingEntity;
  }

  public setImportingEntity(importer: Module): void {
    this.importingEntity = importer;
    importer.addOutgoingImport(this); // opposite
  }

  private importedEntity: NamedEntity;

  public getImportedEntity(): NamedEntity {
    return this.importedEntity;
  }

  public setImportedEntity(importedEntity: NamedEntity): void {
    this.importedEntity = importedEntity;
    importedEntity.addIncomingImport(this); // incomingImports in Famix TImportable/TImport
  }

  private moduleSpecifier: string;

  public getModuleSpecifier(): string {
    return this.moduleSpecifier;
  }

  public setModuleSpecifier(moduleSpecifier: string): void {
    this.moduleSpecifier = moduleSpecifier;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ImportClause", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("importingEntity", this.getImportingEntity());
    exporter.addProperty("importedEntity", this.getImportedEntity());
    exporter.addProperty("moduleSpecifier", this.getModuleSpecifier());
  }
}
