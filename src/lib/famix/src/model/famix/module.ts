// automatically generated code, please do not change (sorry, changed by C. Fuhrman)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { CompilationUnit } from "./../famix/compilation_unit";
import { ScopingEntity } from "./../famix/scoping_entity";
import { LocalVariable } from "./local_variable";

export class Module extends ScopingEntity {

  private moduleCompilationUnit: CompilationUnit;

  // @FameProperty(name = "compilationUnit", opposite = "module")
  public getCompilationUnit(): CompilationUnit {
    return this.moduleCompilationUnit;
  }

  public setCompilationUnit(newCompilationUnit: CompilationUnit) {
    if (this.moduleCompilationUnit === undefined) {
      this.moduleCompilationUnit = newCompilationUnit;
      newCompilationUnit.setModule(this);
    }
  }

  private scopingEntityLocalVariables: Set<LocalVariable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "localVariables", opposite = "parentBehaviouralEntity", derived = true)
  public getLocalVariables(): Set<LocalVariable> {
    return this.scopingEntityLocalVariables;
  }

  // manyOne.Setter
  public addLocalVariables(scopingEntityLocalVariables: LocalVariable) {
    if (!this.scopingEntityLocalVariables.has(scopingEntityLocalVariables)) {
      this.scopingEntityLocalVariables.add(scopingEntityLocalVariables);
      // TODO scopingEntityLocalVariables.setParentBehaviouralEntity(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("compilationUnit", this.getCompilationUnit());
    exporter.addProperty("localVariables", this.getLocalVariables());

  }

}

