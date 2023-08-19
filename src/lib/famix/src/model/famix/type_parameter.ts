import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { ParameterizableClass } from "./parameterizable_class";
import { ParameterizableInterface } from "./parameterizable_interface";

export class TypeParameter extends Type {

  private parentGeneric: ParameterizableClass | ParameterizableInterface;

  public getParentGeneric(): ParameterizableClass | ParameterizableInterface {
    return this.parentGeneric;
  }

  public setParentGeneric(parentGeneric: ParameterizableClass | ParameterizableInterface): void {
    this.parentGeneric = parentGeneric;
    parentGeneric.addTypeParameter(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("TypeParameter", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentGeneric", this.getParentGeneric());
  }
}
