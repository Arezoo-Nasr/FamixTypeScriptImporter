import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { ParameterizedType } from "./parameterized_type";
import { Interface } from "./interface";
import { TypeParameter } from "./type_parameter";

export class ParameterizableInterface extends Interface {

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

  private typeParameters: Set<TypeParameter> = new Set();

  public getTypeParameters(): Set<TypeParameter> {
    return this.typeParameters;
  }

  public addTypeParameter(typeParameter: TypeParameter): void {
    if (!this.typeParameters.has(typeParameter)) {
      this.typeParameters.add(typeParameter);
      typeParameter.setParentGeneric(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ParameterizableInterface", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parameterizedTypes", this.getParameterizedTypes());
    exporter.addProperty("typeParameters", this.getTypeParameters());
  }
}
