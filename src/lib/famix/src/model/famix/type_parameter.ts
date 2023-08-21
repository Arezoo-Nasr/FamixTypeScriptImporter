import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { ParameterizableClass } from "./parameterizable_class";
import { ParameterizableInterface } from "./parameterizable_interface";
import { Method } from "./method";
import { Function } from "./function";

export class TypeParameter extends Type {

  private parentGeneric: ParameterizableClass | ParameterizableInterface | Method | Function;

  public getParentGeneric(): ParameterizableClass | ParameterizableInterface | Method | Function {
    return this.parentGeneric;
  }

  public setParentGeneric(parentGeneric: ParameterizableClass | ParameterizableInterface | Method | Function): void {
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
