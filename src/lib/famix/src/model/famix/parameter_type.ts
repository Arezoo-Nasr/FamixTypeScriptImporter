import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { ParameterizableClass } from "./parameterizable_class";

export class ParameterType extends Type {

  private parentGeneric: ParameterizableClass;

  public getParentGeneric(): ParameterizableClass {
    return this.parentGeneric;
  }

  public setParentGeneric(parentGeneric: ParameterizableClass): void {
    this.parentGeneric = parentGeneric;
    parentGeneric.addParameterType(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentGeneric", this.getParentGeneric());
  }
}
