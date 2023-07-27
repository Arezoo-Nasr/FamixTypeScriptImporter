// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ParameterizedType } from "./../famix/parameterized_type";
import { Class } from "./../famix/class";
import { ParameterType } from "./../famix/parameter_type";

export class ParameterizableClass extends Class {

  private parameterizedTypes: Set<ParameterizedType> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "parameterizedTypes", opposite = "parameterizableClass", derived = true)
  public getParameterizedTypes(): Set<ParameterizedType> {
    return this.parameterizedTypes;
  }

  // manyOne.Setter
  public addParameterizedType(parameterizedType: ParameterizedType) {
    if (!this.parameterizedTypes.has(parameterizedType)) {
      this.parameterizedTypes.add(parameterizedType);
      parameterizedType.setParameterizableClass(this);
    }
  }

  private parameters: Set<ParameterType> = new Set();

  public getParameterTypes() {
    return this.parameters;
  }

  public addParameterType(p: ParameterType) {
    this.parameters.add(p);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizableClass", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parameterizedTypes", this.getParameterizedTypes());
    exporter.addProperty("parameters", this.getParameterTypes());

  }

}

