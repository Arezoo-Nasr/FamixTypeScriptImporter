import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { BehavioralEntity } from "./behavioral_entity";
import { Class } from "./class";

export class Method extends BehavioralEntity {

  private parentEntity: Class;

  public getParentEntity(): Class {
    return this.parentEntity;
  }

  public setParentEntity(parentEntity: Class): void {
    this.parentEntity = parentEntity;
    parentEntity.addMethod(this);
  }

  private isAbstract: boolean;

  public getIsAbstract(): boolean {
    return this.isAbstract;
  }

  public setIsAbstract(isAbstract: boolean): void {
    this.isAbstract = isAbstract;
  }
  
  private isConstructor: boolean;

  public getIsConstructor(): boolean {
    return this.isConstructor;
  }

  public setIsConstructor(isConstructor: boolean): void {
    this.isConstructor = isConstructor;
  }

  private isClassSide: boolean;

  public getIsClassSide(): boolean {
    return this.isClassSide;
  }

  public setIsClassSide(isClassSide: boolean): void {
    this.isClassSide = isClassSide;
  }

  private isPrivate: boolean;

  public getIsPrivate(): boolean {
    return this.isPrivate;
  }

  public setIsPrivate(isPrivate: boolean): void {
    this.isPrivate = isPrivate;
  }

  private isPublic: boolean;

  public getIsPublic(): boolean {
    return this.isPublic;
  }

  public setIsPublic(isPublic: boolean): void {
    this.isPublic = isPublic;
  }

  private isProtected: boolean;

  public getIsProtected(): boolean {
    return this.isProtected;
  }

  public setIsProtected(isProtected: boolean): void {
    this.isProtected = isProtected;
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Method", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentEntity", this.getParentEntity());
    exporter.addProperty("isAbstract", this.getIsAbstract());
    exporter.addProperty("isConstructor", this.getIsConstructor());
    exporter.addProperty("isClassSide", this.getIsClassSide());
    exporter.addProperty("isPrivate", this.getIsPrivate());
    exporter.addProperty("isPublic", this.getIsPublic());
    exporter.addProperty("isProtected", this.getIsProtected());
  }
}
