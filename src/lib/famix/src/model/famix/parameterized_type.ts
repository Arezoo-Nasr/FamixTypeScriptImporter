// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { ParameterizableClass } from "./parameterizable_class";
import { Class } from "./class";

export class ParameterizedType extends Class {

  private parameterizedTypeParameterizableClass: ParameterizableClass;

  // oneMany.Getter
  // @FameProperty(name = "parameterizableClass", opposite = "parameterizedTypes")
  public getParameterizableClass(): ParameterizableClass {
    return this.parameterizedTypeParameterizableClass;
  }

  // oneMany.Setter
  public setParameterizableClass(newParameterizableClass: ParameterizableClass) {
    this.parameterizedTypeParameterizableClass = newParameterizableClass;
    newParameterizableClass.getParameterizedTypes().add(this);
  }

  private typeArguments: Set<Type> = new Set();

  // manyMany.Getter
  // @FameProperty(name = "arguments", opposite = "argumentsInParameterizedTypes")
  public getArguments(): Set<Type> {
    return this.typeArguments;
  }

  // manyMany.Setter
  public addArgument(newArgument: Type) {
    if (!this.typeArguments.has(newArgument)) {
      this.typeArguments.add(newArgument);
      newArgument.getArgumentsInParameterizedTypes().add(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizedType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parameterizableClass", this.getParameterizableClass());
    exporter.addProperty("arguments", this.getArguments());

  }

}

