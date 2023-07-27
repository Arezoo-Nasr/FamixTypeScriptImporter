// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScriptEntity } from "./../famix/script_entity";
import { ImportClause } from "./import_clause";

export class Module extends ScriptEntity {

  private importClauses: Set<ImportClause> = new Set();

  public getImportClauses(): Set<ImportClause> {
    return this.importClauses;
  }

  public addImportClause(newImportClause: ImportClause) {
    if (!this.importClauses.has(newImportClause)) {
      this.importClauses.add(newImportClause);
      newImportClause.setImporter(this);
    }
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

