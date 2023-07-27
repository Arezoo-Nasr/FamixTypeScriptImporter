// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";
import { ParameterizableClass } from "./parameterizable_class";

export class ParameterType extends Type {

  private parentGeneric: ParameterizableClass;

  public getParentGeneric(): ParameterizableClass {
    return this.parentGeneric;
  }

  public setParentGeneric(newParentGeneric: ParameterizableClass) {
    this.parentGeneric = newParentGeneric;
    newParentGeneric.addParameterType(this);
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

