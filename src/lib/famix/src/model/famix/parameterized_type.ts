import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
// import { ParameterizableClass } from "./parameterizable_class";
// import { ParameterizableInterface } from "./parameterizable_interface";
// import { Method } from "./method";
// import { Function } from "./function";
// import { Accessor } from "./accessor";

export class ParameterizedType extends Type {

  // private parentGeneric: ParameterizableClass | ParameterizableInterface | Method | Accessor | Function;

  // public getParentGeneric(): ParameterizableClass | ParameterizableInterface | Method | Accessor | Function {
  //   return this.parentGeneric;
  // }

  // public setParentGeneric(parentGeneric: ParameterizableClass | ParameterizableInterface | Method | Accessor | Function): void {
  //   this.parentGeneric = parentGeneric;
  //   parentGeneric.addParameterizedType(this);
  // }

  private baseType: Type;

  public getBaseType(): Type {
    return this.baseType;
  }

  public setBaseType(baseType: Type): void {
    this.baseType = baseType;
  }

  private arguments: Set<Type> = new Set();

  public getArguments(): Set<Type> {
    return this.arguments;
  }

  public addArgument(argument: Type): void {
    if (!this.arguments.has(argument)) {
      this.arguments.add(argument);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizedType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    //exporter.addProperty("parentGeneric", this.getParentGeneric());
    exporter.addProperty("baseType", this.getBaseType());
    exporter.addProperty("arguments", this.getArguments());
  }
}
