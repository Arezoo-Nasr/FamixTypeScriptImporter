import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { Variable } from "./variable";

export class VariableStatement extends Type {

  private variablesInStatement: Set<Variable> = new Set();

  public getVariablesInStatement(): Set<Variable> {
    return this.variablesInStatement;
  }

  public addVariableInStatement(variableInStatement: Variable): void {
    if (!this.variablesInStatement.has(variableInStatement)) {
      this.variablesInStatement.add(variableInStatement);
      variableInStatement.setParentEntity(this);
    }
  }
  

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("VariableStatement", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("variablesInStatement", this.getVariablesInStatement());
  }
}
