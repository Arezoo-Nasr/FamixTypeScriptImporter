// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { BehavioralEntity } from "./behavioral_entity";

export class Method extends BehavioralEntity {





  private methodParentType: Type;

  // oneMany.Getter
  // @FameProperty(name = "parentType", opposite = "methods")
  public getParentType(): Type {
    return this.methodParentType;
  }

  // oneMany.Setter
  public setParentType(newParentType: Type) {
    this.methodParentType = newParentType;
    newParentType.getMethods().add(this);
  }





  private isAbstract: boolean;

  public getIsAbstract(): boolean {
    return this.isAbstract;
  }

  public setIsAbstract(isAbstract: boolean) {
    this.isAbstract = isAbstract;
  }
  
  private isConstructor: boolean;

  public getIsConstructor(): boolean {
    return this.isConstructor;
  }

  public setIsConstructor(isConstructor: boolean) {
    this.isConstructor = isConstructor;
  }

  private isClassSide: boolean;

  public getIsClassSide(): boolean {
    return this.isClassSide;
  }

  public setIsClassSide(isClassSide: boolean) {
    this.isClassSide = isClassSide;
  }

  private isPrivate: boolean;

  public getIsPrivate(): boolean {
    return this.isPrivate;
  }

  public setIsPrivate(isPrivate: boolean) {
    this.isPrivate = isPrivate;
  }

  private isPublic: boolean;

  public getIsPublic(): boolean {
    return this.isPublic;
  }

  public setIsPublic(isPublic: boolean) {
    this.isPublic = isPublic;
  }

  private isProtected: boolean;

  public getIsProtected(): boolean {
    return this.isProtected;
  }

  public setIsProtected(isProtected: boolean) {
    this.isProtected = isProtected;
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Method", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);

    exporter.addProperty("parentType", this.getParentType());
    exporter.addProperty("isAbstract", this.getIsAbstract());
    exporter.addProperty("isConstructor", this.getIsConstructor());
    exporter.addProperty("isClassSide", this.getIsClassSide());
    exporter.addProperty("isPrivate", this.getIsPrivate());
    exporter.addProperty("isPublic", this.getIsPrivate());
    exporter.addProperty("isProtected", this.getIsPrivate());
  }

}

