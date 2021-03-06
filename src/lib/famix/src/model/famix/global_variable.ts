// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { ScopingEntity } from "./../famix/scoping_entity";
import { Module } from "./../famix/module";

export class GlobalVariable extends StructuralEntity {

  private globalVariableParentScope: ScopingEntity;

  // oneMany.Getter
  // @FameProperty(name = "parentScope", opposite = "globalVariables")
  public getParentScope(): ScopingEntity {
    return this.globalVariableParentScope;
  }

  // oneMany.Setter
  public setParentScope(newParentScope: ScopingEntity) {
    this.globalVariableParentScope = newParentScope;
    newParentScope.getGlobalVariables().add(this);
  }

  private globalVariableParentModule: Module;

  // @FameProperty(name = "parentModule")
  public getParentModule(): Module {
    return this.globalVariableParentModule;
  }

  public setParentModule(globalVariableParentModule: Module) {
    this.globalVariableParentModule = globalVariableParentModule;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("GlobalVariable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentScope", this.getParentScope());
    exporter.addProperty("parentModule", this.getParentModule());

  }

}

