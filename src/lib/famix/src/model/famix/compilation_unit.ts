// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Module } from "./../famix/module";
import { File } from "./../file/file";

export class CompilationUnit extends File {

  private compilationUnitModule: Module;

  // @FameProperty(name = "module", opposite = "compilationUnit")
  public getModule(): Module {
    return this.compilationUnitModule;
  }

  public setModule(newModule: Module) {
    if (this.compilationUnitModule === undefined) {
      this.compilationUnitModule = newModule;
      newModule.setCompilationUnit(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("CompilationUnit", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("module", this.getModule());

  }

}

