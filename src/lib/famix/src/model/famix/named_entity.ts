// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourcedEntity } from "./../famix/sourced_entity";
import { Invocation } from "./../famix/invocation";
import { ImportClause } from "./import_clause";
import { Alias } from "./alias";

export class NamedEntity extends SourcedEntity {


  private receivedInvocations: Set<Invocation> = new Set();


  public getReceivedInvocations(): Set<Invocation> {
    return this.receivedInvocations;
  }

  public addReceivedInvocation(newReceivedInvocation: Invocation) {
    if (!this.receivedInvocations.has(newReceivedInvocation)) {
      this.receivedInvocations.add(newReceivedInvocation);
      newReceivedInvocation.setReceiver(this);
    }
  }

  private imports: Set<ImportClause> = new Set();


  public getImports(): Set<ImportClause> {
    return this.imports;
  }

  public addImport(newImport: ImportClause) {
    if (!this.imports.has(newImport)) {
      this.imports.add(newImport);
      newImport.setImportedEntity(this);
    }
  }


  private namedEntityName: string;

  // @FameProperty(name = "name")
  public getName(): string {
    return this.namedEntityName;
  }

  public setName(namedEntityName: string) {
    this.namedEntityName = namedEntityName;
  }


  private aliases: Set<Alias> = new Set();

  public getAliases(): Set<Alias> {
    return this.aliases;
  }

  public addAlias(newAlias: Alias) {
    if (!this.aliases.has(newAlias)) {
      this.aliases.add(newAlias);
      newAlias.setAliasedEntity(this);
    }
  }



  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("NamedEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("name", this.getName());
    exporter.addProperty("receivedInvocations", this.getReceivedInvocations());


  }

}

