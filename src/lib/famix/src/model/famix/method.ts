// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { CaughtException } from "./../famix/caught_exception";
import { DeclaredException } from "./../famix/declared_exception";
import { Type } from "./../famix/type";
import { BehaviouralEntity } from "./../famix/behavioural_entity";
import { ThrownException } from "./../famix/thrown_exception";

export class Method extends BehaviouralEntity {

  private methodKind: string;

  // @FameProperty(name = "kind")
  public getKind(): string {
    return this.methodKind;
  }

  public setKind(methodKind: string) {
    this.methodKind = methodKind;
  }

  private methodThrownExceptions: Set<ThrownException> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "thrownExceptions", opposite = "definingMethod", derived = true)
  public getThrownExceptions(): Set<ThrownException> {
    return this.methodThrownExceptions;
  }

  // manyOne.Setter
  public addThrownExceptions(methodThrownExceptions: ThrownException) {
    if (!this.methodThrownExceptions.has(methodThrownExceptions)) {
      this.methodThrownExceptions.add(methodThrownExceptions);
      methodThrownExceptions.setDefiningMethod(this);
    }
  }

  private methodCaughtExceptions: Set<CaughtException> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "caughtExceptions", opposite = "definingMethod", derived = true)
  public getCaughtExceptions(): Set<CaughtException> {
    return this.methodCaughtExceptions;
  }

  // manyOne.Setter
  public addCaughtExceptions(methodCaughtExceptions: CaughtException) {
    if (!this.methodCaughtExceptions.has(methodCaughtExceptions)) {
      this.methodCaughtExceptions.add(methodCaughtExceptions);
      methodCaughtExceptions.setDefiningMethod(this);
    }
  }

  private methodHasClassScope: boolean;

  // @FameProperty(name = "hasClassScope")
  public getHasClassScope(): boolean {
    return this.methodHasClassScope;
  }

  public setHasClassScope(methodHasClassScope: boolean) {
    this.methodHasClassScope = methodHasClassScope;
  }

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

  private methodTimeStamp: string;

  // @FameProperty(name = "timeStamp")
  public getTimeStamp(): string {
    return this.methodTimeStamp;
  }

  public setTimeStamp(methodTimeStamp: string) {
    this.methodTimeStamp = methodTimeStamp;
  }

  private methodDeclaredExceptions: Set<DeclaredException> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "declaredExceptions", opposite = "definingMethod", derived = true)
  public getDeclaredExceptions(): Set<DeclaredException> {
    return this.methodDeclaredExceptions;
  }

  // manyOne.Setter
  public addDeclaredExceptions(methodDeclaredExceptions: DeclaredException) {
    if (!this.methodDeclaredExceptions.has(methodDeclaredExceptions)) {
      this.methodDeclaredExceptions.add(methodDeclaredExceptions);
      methodDeclaredExceptions.setDefiningMethod(this);
    }
  }

  private methodCategory: string;

  // @FameProperty(name = "category")
  public getCategory(): string {
    return this.methodCategory;
  }

  public setCategory(methodCategory: string) {
    this.methodCategory = methodCategory;
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
    exporter.addProperty("timeStamp", this.getTimeStamp());
    exporter.addProperty("kind", this.getKind());
    exporter.addProperty("thrownExceptions", this.getThrownExceptions());
    exporter.addProperty("caughtExceptions", this.getCaughtExceptions());
    exporter.addProperty("declaredExceptions", this.getDeclaredExceptions());
    exporter.addProperty("hasClassScope", this.getHasClassScope());
    exporter.addProperty("category", this.getCategory());
    exporter.addProperty("parentType", this.getParentType());
    exporter.addProperty("isAbstract", this.getIsAbstract());
    exporter.addProperty("isConstructor", this.getIsConstructor());
    exporter.addProperty("isClassSide", this.getIsClassSide());
    exporter.addProperty("isPrivate", this.getIsPrivate());
    exporter.addProperty("isPublic", this.getIsPrivate());
    exporter.addProperty("isProtected", this.getIsPrivate());
  }

}

