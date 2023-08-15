import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { Variable } from "./variable";

export class VariableStatement extends Type {

  private variables: Set<Variable> = new Set();

  public getVariables(): Set<Variable> {
    return this.variables;
  }

  public addVariable(variable: Variable): void {
    if (!this.variables.has(variable)) {
      this.variables.add(variable);
      variable.setParentEntity(this);
    }
  }
  

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("VariableStatement", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("variables", this.getVariables());
  }
}
