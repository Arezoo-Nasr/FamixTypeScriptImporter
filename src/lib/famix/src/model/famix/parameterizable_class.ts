// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ParameterizedType } from "./../famix/parameterized_type";
import { Class } from "./../famix/class";

export class ParameterizableClass extends Class {

  private parameterizableClassParameterizedTypes: Set<ParameterizedType> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "parameterizedTypes", opposite = "parameterizableClass", derived = true)
  public getParameterizedTypes(): Set<ParameterizedType> {
    return this.parameterizableClassParameterizedTypes;
  }

  // manyOne.Setter
  public addParameterizedTypes(parameterizableClassParameterizedTypes: ParameterizedType) {
    if (!this.parameterizableClassParameterizedTypes.has(parameterizableClassParameterizedTypes)) {
      this.parameterizableClassParameterizedTypes.add(parameterizableClassParameterizedTypes);
      parameterizableClassParameterizedTypes.setParameterizableClass(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizableClass", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parameterizedTypes", this.getParameterizedTypes());

  }

}

