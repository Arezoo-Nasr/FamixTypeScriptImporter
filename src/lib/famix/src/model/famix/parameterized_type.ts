import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Type } from "./type";
import { ParameterizableClass } from "./parameterizable_class";
import { Class } from "./class";

export class ParameterizedType extends Class {

  private parentGeneric: ParameterizableClass;

  public getParentGeneric(): ParameterizableClass {
    return this.parentGeneric;
  }

  public setParentGeneric(parentGeneric: ParameterizableClass): void {
    this.parentGeneric = parentGeneric;
    parentGeneric.addParameterizedType(this);
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
    exporter.addProperty("parentGeneric", this.getParentGeneric());
    exporter.addProperty("arguments", this.getArguments());
  }
}
