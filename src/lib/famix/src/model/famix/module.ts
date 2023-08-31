import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScriptEntity } from "./script_entity";
import { ImportClause } from "./import_clause";

export class Module extends ScriptEntity {

  private importClauses: Set<ImportClause> = new Set();

  public getImportClauses(): Set<ImportClause> {
    return this.importClauses;
  }

  public addImportClause(importClause: ImportClause): void {
    if (!this.importClauses.has(importClause)) {
      this.importClauses.add(importClause);
      importClause.setImporter(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("importClauses", this.getImportClauses());
  }
}
