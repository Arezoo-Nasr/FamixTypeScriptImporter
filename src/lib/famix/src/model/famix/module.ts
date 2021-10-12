// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { CompilationUnit } from "./../famix/compilation_unit";
import { ScopingEntity } from "./../famix/scoping_entity";

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


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Module", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("compilationUnit", this.getCompilationUnit());

  }

}

