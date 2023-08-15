import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { ParameterizedType } from "./parameterized_type";
import { Class } from "./class";
import { ParameterType } from "./parameter_type";

export class ParameterizableClass extends Class {

  private parameterizedTypes: Set<ParameterizedType> = new Set();

  public getParameterizedTypes(): Set<ParameterizedType> {
    return this.parameterizedTypes;
  }

  public addParameterizedType(parameterizedType: ParameterizedType): void {
    if (!this.parameterizedTypes.has(parameterizedType)) {
      this.parameterizedTypes.add(parameterizedType);
      parameterizedType.setParentGeneric(this);
    }
  }

  private parameterTypes: Set<ParameterType> = new Set();

  public getParameterTypes() {
    return this.parameterTypes;
  }

  public addParameterType(parameterType: ParameterType): void {
    if (!this.parameterTypes.has(parameterType)) {
      this.parameterTypes.add(parameterType);
      parameterType.setParentGeneric(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizableClass", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parameterizedTypes", this.getParameterizedTypes());
    exporter.addProperty("parameterTypes", this.getParameterTypes());
  }
}
